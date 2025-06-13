import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/authOptions';
import Order from '../../../../../models/Order';
import dbConnect from '../../../../../lib/dbConnect';


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Fetch orders for the logged-in user
    const orders = await Order.find({ user: session.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 }); // Sort by most recent orders first

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching payment tracking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment tracking data', details: error.message },
      { status: 500 }
    );
  }
}