import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ emailId: string; attachmentIndex: string }> }
) {
    try {
        const { emailId, attachmentIndex } = await params;
        const index = parseInt(attachmentIndex);

        // Get email from Firestore
        const emailDoc = await db.collection('emails').doc(emailId).get();
        
        if (!emailDoc.exists) {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 });
        }

        const emailData = emailDoc.data();
        const attachments = emailData?.attachments || [];

        if (index < 0 || index >= attachments.length) {
            return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
        }

        const attachment = attachments[index];
        
        if (!attachment.data) {
            return NextResponse.json({ error: 'Attachment data not available' }, { status: 404 });
        }

        // Decode base64 data
        const buffer = Buffer.from(attachment.data, 'base64');

        // Return file with proper headers
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': attachment.contentType || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${attachment.filename}"`,
                'Content-Length': buffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('Error downloading attachment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
