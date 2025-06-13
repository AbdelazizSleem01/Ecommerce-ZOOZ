import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../lib/dbConnect';
import Blog from '../../../../models/blog';
import { uploadImages } from '../../../../lib/cloudinary';
import { authOptions } from '../../../../lib/authOptions';


export async function GET() {
    try {
        await dbConnect();

        const blogs = await Blog.find({ published: true })
            .populate('authorDetails', 'name profilePicture')
            .sort({ createdAt: -1 });

        return NextResponse.json(blogs);
    } catch (error) {
        return NextResponse.json(
            { message: 'Error fetching blogs', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        await dbConnect();

        const formData = await req.formData();
        const title = formData.get('title');
        const content = formData.get('content');
        const excerpt = formData.get('excerpt');
        const coverImage = formData.get('coverImage');
        const tags = formData.get('tags')?.split(',') || [];
        const categories = formData.get('categories')?.split(',') || [];
        const featured = formData.get('featured') === 'true';
        const published = formData.get('published') === 'true';

        if (!title || !content || !coverImage) {
            return NextResponse.json(
                { message: 'Title, content and cover image are required' },
                { status: 400 }
            );
        }

        // Upload cover image to Cloudinary
        const [coverImageUrl] = await uploadImages([coverImage], 'blog-images');

        const slug = title.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .substring(0, 60);

        const newBlog = new Blog({
            title,
            slug,
            content,
            excerpt,
            coverImage: coverImageUrl,
            author: session.user.id,
            authorAvatar: session.user.profilePicture || '/images/default-avatar.png',
            tags,
            categories,
            featured,
            published,
            publishedAt: published ? new Date() : null,
            metaTitle: title.substring(0, 60),
            metaDescription: excerpt.substring(0, 160)
        });

        await newBlog.save();

        return NextResponse.json(
            { message: 'Blog created successfully', blog: newBlog },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error creating blog', error: error.message },
            { status: 500 }
        );
    }
}