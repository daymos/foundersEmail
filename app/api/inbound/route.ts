import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
// import crypto from 'crypto'; // Removed
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
    try {
        // Mailjet sends JSON
        const body = await req.json();

        // Log the full payload for debugging
        console.log('Received email payload:', JSON.stringify(body, null, 2));

        // Mailjet structure varies, but typically:
        // { From, To, Subject, Text-part, Html-part, Attachments, ... }
        // Note: Configure webhook in Mailjet to send "Parse API" events

        const sender = body.From || body.Sender || '';
        const recipient = body.To || body.Recipient || '';
        const subject = body.Subject || '(No Subject)';
        const bodyPlain = body['Text-part'] || body.TextPart || '';
        const bodyHtml = body['Html-part'] || body.HtmlPart || '';

        // Handle attachments
        const attachments = body.Attachments || body.attachments || [];
        const attachmentInfo = attachments.map((att: any) => ({
            filename: att.Name || att.Filename || att.filename || 'unknown',
            contentType: att['Content-Type'] || att.ContentType || att.contentType || 'application/octet-stream',
            size: att.ContentLength || att.Size || att.size || 0,
        }));

        // Log if email appears empty
        if (!bodyPlain && !bodyHtml && attachments.length > 0) {
            console.log('Email has only attachments, no text/html body');
        }

        // Store in Firestore
        await db.collection('emails').add({
            sender,
            recipient,
            subject,
            bodyPlain,
            bodyHtml,
            strippedText: bodyPlain,
            attachments: attachmentInfo,
            hasAttachments: attachmentInfo.length > 0,
            receivedAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
            replied: false
        });

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Error processing inbound email:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
