import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Category from "../../../../models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";


// 📌 GET: Fetch all categories
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const category = await Category.findOne({ slug }).populate("parent");
      if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
      return NextResponse.json(category, { status: 200 });
    }

    const categories = await Category.find().populate("parent");
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 POST: Create a new category
export async function POST(req) {
  try {
    await dbConnect();

    const { name, slug, parent, properties } = await req.json();

    // Validate fields
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    // Create category
    const newCategory = await Category.create({ name, slug, parent, properties });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
