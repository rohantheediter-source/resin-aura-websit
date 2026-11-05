import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      // In demo mode without keys, consider mock payments verified
      return NextResponse.json({
        verified: true,
        isMock: true,
        message: 'Payment verified in development mode',
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return NextResponse.json({
        verified: true,
        message: 'Payment signature verified successfully',
      });
    } else {
      return NextResponse.json(
        { verified: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

