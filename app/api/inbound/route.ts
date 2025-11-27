import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
// import crypto from 'crypto'; // Removed
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
    try {
        // Mailjet sends JSON
        const body = await req.json();

        // Mailjet structure varies, but typically:
        // { From, To, Subject, Text-part, Html-part, ... }
        // Note: Configure webhook in Mailjet to send "Parse API" events

        const sender = body.From || body.Sender;
        const recipient = body.To || body.Recipient;
        const subject = body.Subject;
        const bodyPlain = body['Text-part'] || body.TextPart || '';
        const bodyHtml = body['Html-part'] || body.HtmlPart || '';

        // Store in Firestore
        await db.collection('emails').add({
            sender,
            recipient,
            subject,
            bodyPlain,
            bodyHtml,
            strippedText: bodyPlain,
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
