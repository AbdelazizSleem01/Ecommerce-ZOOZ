import { NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Product from '../../../../../../models/Product';


export async function GET(req, { params }) {
  try {
    await dbConnect();
    const products = await Product.find({ brand: params.brandId });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}