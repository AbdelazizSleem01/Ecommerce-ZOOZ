import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions';
import dbConnect from '../../../../lib/dbConnect';
import Order from '../../../../models/Order';
import Cart from '../../../../models/Cart';
import Product from '../../../../models/Product';
import Notification from '../../../../models/Notification';
import mongoose from 'mongoose';
import User from '../../../../models/User';
import { nanoid } from 'nanoid'; 

function calculateEstimatedDelivery() {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3); // Default 3 days for standard shipping
  return deliveryDate;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const orders = await Order.find({ user: session.user.id })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const mongooseSession = await mongoose.startSession();
  let savedOrder;

  try {
    const { paymentIntentId, amount, paymentMethod, shippingAddress, shippingMethod } = await request.json();

    if (!paymentIntentId || !amount) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    await mongooseSession.withTransaction(async () => {
      // Transaction operations
      const cart = await Cart.findOne({ user: session.user.id })
        .populate('items.product')
        .session(mongooseSession);

      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      for (const item of cart.items) {
        const product = await Product.findById(item.product._id).session(mongooseSession);
        if (!product) throw new Error(`Product ${item.product._id} not found`);
        if (product.countInStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      for (const item of cart.items) {
        await Product.findByIdAndUpdate(
          item.product._id,
          { $inc: { countInStock: -item.quantity } },
          { session: mongooseSession }
        );
      }

      const order = new Order({
        user: session.user.id,
        orderItems: cart.items.map(item => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.images?.[0] || '',
          price: item.product.price,
          product: item.product._id,
          size: item.size,
          color: item.color,
        })),
        totalPrice: amount,
        paymentResult: { id: paymentIntentId, status: 'completed' },
        paymentMethod,
        shippingAddress: shippingAddress || {},
        isPaid: true,
        paidAt: new Date(),
        tracking: {
          number: `ZOOZ-${nanoid(8).toUpperCase()}`, // Custom format with prefix
          carrier: shippingMethod === 'express' ? 'FedEx' : 'USPS',
          status: 'processing',
          estimatedDelivery: calculateEstimatedDelivery(),
          lastUpdated: new Date()
        }
      });

      savedOrder = await order.save({ session: mongooseSession });

      // Clear cart
      await Cart.findByIdAndDelete(cart._id, { session: mongooseSession });

      const admins = await User.find({ isAdmin: true }).select('_id').session(mongooseSession);
      const notification = new Notification({
        message: `New order placed by ${session.user.name}`,
        link: `/admin/orders/${savedOrder._id}`,
        recipients: admins.map(admin => admin._id),
        type: 'order',
        relatedUser: session.user.id,
      });
      await notification.save({ session: mongooseSession });
    });

    return NextResponse.json(savedOrder);

  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    await mongooseSession.endSession();
  }
}