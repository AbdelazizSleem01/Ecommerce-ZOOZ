import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Product from '../../../../../models/Product';

// Fetch featured products
export async function GET() {
  try {
    await dbConnect();

    const featuredProducts = await Product.find({ isFeatured: true })
      .populate({
        path: 'category',
      })
      .lean();

    return NextResponse.json(featuredProducts, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}