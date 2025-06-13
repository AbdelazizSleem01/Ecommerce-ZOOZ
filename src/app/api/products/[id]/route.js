import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../../lib/dbConnect';
import Product from '../../../../../models/Product';
import { authOptions } from '../../../../../lib/authOptions';
import { uploadImages } from '../../../../../lib/cloudinary';

// Fetch a single product by ID
export async function GET(req, { params }) {
  await dbConnect();
  const { id } =await params;

  try {
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return NextResponse.json(
      { message: 'Error fetching product', error: error.message },
      { status: 500 }
    );
  }
}

// Update a product by ID
export async function PUT(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('images');
    const imageUrls = files.length > 0 ? await uploadImages(files) : undefined;

    const body = Object.fromEntries(formData.entries());
    const updatedData = {
      ...body,
      images: imageUrls || body.images,
      sizes: Array.isArray(body.sizes) ? body.sizes : body.sizes.split(',').map((size) => size.trim()).filter(Boolean),
      colors: Array.isArray(body.colors) ? body.colors : body.colors.split(',').map((color) => color.trim()).filter(Boolean),
    };

    const updatedProduct = await Product.findByIdAndUpdate(params.id, updatedData, {
      new: true,
    }).populate('category');

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json(
      { message: 'Error updating product', error: error.message },
      { status: 500 }
    );
  }
}

// Delete a product by ID
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = await params; 
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json(
      { message: 'Error deleting product', error: error.message },
      { status: 500 }
    );
  }
}