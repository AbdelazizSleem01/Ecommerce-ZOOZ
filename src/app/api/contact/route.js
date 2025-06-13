import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Contact from '../../../../models/Contact';
import { authOptions } from '../../../../lib/authOptions';
import { getServerSession } from 'next-auth';
import { sendEmail } from '../../../../lib/email';
import Notification from '../../../../models/Notification';
import User from '../../../../models/User';
import mongoose from 'mongoose'; // Added missing mongoose import

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
    await dbConnect();

    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    await dbConnect();
    const mongooseSession = await mongoose.startSession();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validation
        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            throw new Error('All fields are required');
        }

        await mongooseSession.withTransaction(async () => {
            // Create and save contact
            const newContact = await Contact.create([{
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim()
            }], { session: mongooseSession });

            // Send confirmation email to user
            await sendEmail({
                to: email,
                subject: 'Message Received ✓',
                text: `✓ Thank you for contacting us, ${name.trim()}! We'll respond shortly.\n---\nZOOZ E-Commerce`,
                html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <!-- Header with Logo -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <a href="${process.env.NEXT_PUBLIC_API_URL}" target="_blank">
                            <img src="https://sigmawire.net/i/03/t4M8T5.png" 
                                 alt="Your Company Logo" 
                                 style="max-width: 200px; height: auto; margin: 0 auto;">
                        </a>
                    </div>
        
                    <!-- Main Content -->
                    <div style="color: #22c55e; font-size: 24px; margin-bottom: 15px;">✓</div>
                    <h2 style="color: #1a1a1a; margin-bottom: 20px;">Thank you, ${name}!</h2>
                    <p style="color: #444; line-height: 1.6;">
                        We've received your message and will respond within 24-48 hours.
                    </p>
        
                    <!-- Footer -->
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                        <table width="100%">
                            <tr>
                                <td style="padding: 15px 0;">
                                    <a href="${process.env.NEXT_PUBLIC_API_URL}" target="_blank">
                                        <img src="https://sigmawire.net/i/03/t4M8T5.png" 
                                             alt="Company Logo" 
                                             style="max-width: 120px; height: auto;">
                                    </a>
                                </td>
                                <td style="vertical-align: top; padding-left: 20px;">
                                    <div style="color: #666; font-size: 14px;">
                                        <p style="margin: 0 0 8px 0;">ZOOZ E-Commerce</p>
                                        <p style="margin: 0 0 8px 0;">Benha, Qalyubia, EGYPT</p>
                                        <p style="margin: 0 0 8px 0;">Tel: +20 1119268163</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Social Links -->
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://www.facebook.com/profile.php?id=100028557526450" style="text-decoration: none; margin: 0 10px;">
                                <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" 
                                     alt="Facebook" 
                                     style="width: 24px; height: 24px;">
                            </a>
                            
                            <a href="https://www.linkedin.com/in/abdelaziz-sleem-600a1027a/" style="text-decoration: none; margin: 0 10px;">
                                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" 
                                     alt="LinkedIn" 
                                     style="width: 24px; height: 24px;">
                            </a>
                            <a href="https://github.com/AbdelazizSleem01" style="text-decoration: none; margin: 0 10px;">
                                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
                                     alt="GitHub" 
                                     style="width: 24px; height: 24px;">
                            </a>
                        </div>
        
                        <!-- Legal Text -->
                        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
                            This is an automated message. Please do not reply directly to this email.<br>
                            © ${new Date().getFullYear()} ZOOZ E-Commerce. All rights reserved.<br>
                            <a href="${process.env.NEXT_PUBLIC_API_URL}/unsubscribe" 
                               style="color: #666; text-decoration: underline;">
                                Unsubscribe
                            </a>
                        </p>
                    </div>
                </div>
                `
            });

            // Create notification for admins
            const admins = await User.find({ isAdmin: true })
                .select('_id email')
                .session(mongooseSession);

            const notification = await Notification.create([{
                message: `New contact message from ${name}`,
                link: `/admin/contacts`,
                recipients: admins.map(admin => admin._id),
                type: 'contacts',
                relatedUser: session.user.id,
                metadata: {
                    subject: subject,
                    preview: message.length > 50
                        ? `${message.substring(0, 50)}...`
                        : message,
                    fromEmail: email
                },
            }], { session: mongooseSession });

            // Send email notification to admin team
            const adminEmails = admins.map(admin => admin.email).filter(Boolean);
            if (adminEmails.length > 0) {
                await sendEmail({
                    to: adminEmails,
                    subject: `New Contact Message: ${subject}`,
                    text: `You have received a new contact message from ${name} (${email}):\n\n${message}\n\n---\nZOOZ E-Commerce Admin`,
                    html: `
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                        <h2>New Contact Message</h2>
                        <p><strong>From:</strong> ${name} (${email})</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        <a href="${process.env.NEXT_PUBLIC_ADMIN_URL}/contacts/${newContact[0]._id}" 
                           style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
                            View in Admin Panel
                        </a>
                    </div>
                    `
                });
            }
        });

        await mongooseSession.commitTransaction();
        return NextResponse.json(
            { success: true, message: 'Message sent successfully' },
            { status: 201 }
        );

    } catch (error) {
        if (mongooseSession.inTransaction()) {
            await mongooseSession.abortTransaction();
        }
        console.error('Contact submission failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: error.message === 'All fields are required' ? 400 : 500 }
        );
    } finally {
        await mongooseSession.endSession();
    }
}