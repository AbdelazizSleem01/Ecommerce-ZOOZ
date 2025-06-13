// components/CheckoutForm.js
'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Mail, User, MapPin, Phone, CreditCard, Loader2, MapPinHouseIcon, MapPinIcon, CodeSquareIcon } from 'lucide-react';

export default function CheckoutForm({ cartItems }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default to credit card

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    addressLine2: '', // Add address line 2
    email: '',
    phone: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe has not been initialized.');
      return;
    }

    setLoading(true);

    try {
      // Prepare billing details from shipping address
      const billingDetails = {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: {
          line1: shippingAddress.address,
          line2: shippingAddress.addressLine2 || '', 
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country || 'US', 
        },
      };

      let paymentResult;
      if (paymentMethod === 'card') {
        // Handle card payment
        paymentResult = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin + '/order-success',
            payment_method_data: {
              billing_details: billingDetails,
            },
          },
          redirect: 'if_required',
        });
      } else if (paymentMethod === 'paypal') {
        toast.info('PayPal integration is not implemented in this example.');
        return;
      } else {
        toast.error('Invalid payment method selected.');
        return;
      }

      const { error, paymentIntent } = paymentResult;

      if (error) throw error;

      if (paymentIntent.status === 'succeeded') {
        const { data: cart } = await axios.get('/api/cart');
        if (!cart?.items) throw new Error('Cart is empty');

        await axios.post('/api/orders', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, 
          items: cart.items,
          shippingAddress,
        });

        toast.success('Payment successful!');
        router.push('/order-success');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const cartTotal = cartItems
    .reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
    .toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Shipping Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <User className="w-4 h-4" /> First Name
              </span>
            </label>
            <input
              type="text"
              name="firstName"
              value={shippingAddress.firstName}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <User className="w-4 h-4" /> Last Name
              </span>
            </label>
            <input
              type="text"
              name="lastName"
              value={shippingAddress.lastName}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
              required
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <MapPinHouseIcon className="w-4 h-4" /> Street Address
              </span>
            </label>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
              required
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                Address Line 2 (Optional)
              </span>
            </label>
            <input
              type="text"
              name="addressLine2"
              value={shippingAddress.addressLine2}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" /> City
              </span>
            </label>
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <CodeSquareIcon className="w-4 h-4" /> Postal Code
              </span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
              required
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                State
              </span>
            </label>
            <input
              type="text"
              name="state"
              value={shippingAddress.state}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
              required
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <Phone className="w-4 h-4" /> Phone
              </span>
            </label>
            <input
              type="tel"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
              required
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <Mail className="w-4 h-4" /> Email
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={shippingAddress.email}
              onChange={handleShippingAddressChange}
              className="input input-primary w-full"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Payment Details</h2>
        </div>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                Payment Method
              </span>
            </label>
            <select
              name="paymentMethod"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="select select-primary w-full"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {paymentMethod === 'card' && (
            <div className="bg-base-200 p-4 rounded-lg">
              <PaymentElement
                options={{
                  layout: 'tabs',
                  fields: { billingDetails: 'never' }, 
                }}
                className="[&_input]:!bg-base-100 [&_input]:!border-base-300"
              />
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="bg-base-200 p-4 rounded-lg">
              <p className="text-gray-600">PayPal integration is not implemented in this example.</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-primary btn-block btn-lg"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          `Pay $${cartTotal}`
        )}
      </button>
    </form>
  );
}