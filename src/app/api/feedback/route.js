import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Feedback from '../../../../models/Feedback';


export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const role = formData.get('role');
    const email = formData.get('email');
    const comment = formData.get('comment');
    const rating = formData.get('rating');

    if (!name || !role || !email || !comment || !rating ) {
      throw new Error("All fields are required");
    }

    await dbConnect();
    const newFeedback = await Feedback.create({
      name,
      role,
      email,
      comment,
      rating: parseInt(rating),
    });

    return NextResponse.json(
      { message: "Feedback Submitted Successfully", feedback: newFeedback },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/feedback:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const feedbacks = await Feedback.find({});

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Error in GET /api/feedback:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}