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

        // Handle attachments from Mailjet Parse API
        // Attachments are in the Parts array with ContentRef like "Attachment1", "Attachment2", etc.
        const parts = body.Parts || [];
        const attachmentInfo = parts
            .filter((part: any) => part.ContentRef && part.ContentRef.startsWith('Attachment'))
            .map((part: any) => {
                const headers = part.Headers || {};
                // Headers are arrays, get first element
                const contentTypeArray = headers['Content-Type'] || [];
                const contentDispositionArray = headers['Content-Disposition'] || [];
                const contentType = Array.isArray(contentTypeArray) ? contentTypeArray[0] : contentTypeArray || 'application/octet-stream';
                const contentDisposition = Array.isArray(contentDispositionArray) ? contentDispositionArray[0] : contentDispositionArray || '';
                
                // Extract filename from Content-Disposition or Content-Type
                let filename = 'unknown';
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"\\t]/g, '').trim();
                } else {
                    const nameMatch = contentType.match(/name[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (nameMatch && nameMatch[1]) {
                        filename = nameMatch[1].replace(/['"]/g, '').trim();
                    }
                }
                
                // Get attachment content and estimate size
                const attachmentContent = body[part.ContentRef] || '';
                const size = attachmentContent ? Math.round(Buffer.from(attachmentContent, 'base64').length) : 0;
                
                return {
                    filename,
                    contentType: contentType.split(';')[0].trim(),
                    size,
                    contentRef: part.ContentRef,
                    data: attachmentContent // Store base64 data for download
                };
            });

        // Log if email appears empty
        if (!bodyPlain && !bodyHtml && attachmentInfo.length > 0) {
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
            replied: false,
            rawPayload: JSON.stringify(body) // Store raw payload for debugging
        });

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Error processing inbound email:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
