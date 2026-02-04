'use server'

import { db } from '@/lib/firebase';

// Helper to serialize Firestore data (timestamps, etc)
function serialize(data: any) {
    const result = { ...data };
    if (result.receivedAt && typeof result.receivedAt.toDate === 'function') {
        result.receivedAt = result.receivedAt.toDate().toISOString();
    }
    return result;
}

export async function getEmails() {
    try {
        const snapshot = await db.collection('emails').orderBy('receivedAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...serialize(doc.data()) }));
    } catch (error) {
        console.error("Error fetching emails:", error);
        return [];
    }
}

export async function sendReply(emailId: string, to: string, subject: string, text: string, fromEmail?: string) {
    const mailjet = require('node-mailjet').apiConnect(
        process.env.MAILJET_API_KEY || '',
        process.env.MAILJET_API_SECRET || ''
    );

    // Use the provided fromEmail or fall back to SENDER_EMAIL
    const senderEmail = fromEmail || process.env.SENDER_EMAIL;

    try {
        await mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: senderEmail,
                            Name: 'Support'
                        },
                        To: [
                            {
                                Email: to
                            }
                        ],
                        Subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
                        TextPart: text
                    }
                ]
            });

        await db.collection('emails').doc(emailId).update({
            replied: true
        });

        return { success: true };
    } catch (error) {
        console.error("Error sending email via Mailjet:", error);
        return { success: false, error: 'Failed to send email' };
    }
}
