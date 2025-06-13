import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../../lib/dbConnect';
import { authOptions } from '../../../../../lib/authOptions';
import Contact from '../../../../../models/Contact';
import { sendEmail } from '../../../../../lib/email';


export async function PUT(request, { params }) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { response } = await request.json();

        if (!response?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Response is required' },
                { status: 400 }
            );
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            return NextResponse.json(
                { success: false, error: 'Message not found' },
                { status: 404 }
            );
        }

        contact.response = response.trim();
        await contact.save();

        try {
            console.log('Sending response email to:', contact.email);
            await sendEmail({
                to: contact.email,
                subject: 'Response to Your Message',
                text: `Dear ${contact.name},\n\nThank you for contacting us. Here is our response:\n\n${response}\n\nBest regards,\nZOOZ E-Commerce`,
                html: `
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                        <!-- Header with Logo -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <a href=${process.env.NEXT_PUBLIC_API_URL} target="_blank">
                                <img src="https://sigmawire.net/i/03/t4M8T5.png" 
                                     alt="Your Company Logo" 
                                     style="max-width: 200px; height: auto; margin: 0 auto;">
                            </a>
                        </div>
        
                        <!-- Main Content -->
                        <h2 style="color: #1a1a1a; margin-bottom: 20px;">Dear ${contact.name},</h2>
                        <p style="color: #444; line-height: 1.6;">
                            Thank you for contacting us. Here is our response:
                        </p>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="color: #333; font-style: italic;">${response}</p>
                        </div>
                        <p style="color: #444; line-height: 1.6;">
                            If you have any further questions, feel free to reply to this email.
                        </p>
        
                        <!-- Footer -->
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                            <table width="100%">
                                <tr>
                                    <td style="padding: 15px 0;">
                                        <a href=${process.env.NEXT_PUBLIC_API_URL} target="_blank">
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
                            </p>
                        </div>
                    </div>
                `
            });
            console.log('Response email sent successfully');
        } catch (emailError) {
            console.error('Failed to send response email:', emailError);
        }

        return NextResponse.json(
            { success: true, message: 'Response updated and email sent successfully', data: contact },
            { status: 200 }
        );

    } catch (error) {
        console.error('PUT Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Delete Fun


export async function DELETE(request, { params }) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );

        }
        const { id } = await params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return NextResponse.json(
                { success: false, error: 'Message not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, message: 'Message deleted successfully' },
            { status: 200 }
        );

    }
    catch (error) {
        console.error('DELETE Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}