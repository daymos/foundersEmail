'use client'

import { useState, useMemo } from 'react';
import { sendReply } from '@/app/actions';
import { signOut } from 'next-auth/react';

interface Email {
    id: string;
    sender: string;
    recipient: string;
    subject: string;
    bodyPlain: string;
    bodyHtml: string;
    strippedText: string;
    receivedAt: string;
    read: boolean;
    replied: boolean;
}

interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export default function Dashboard({ initialEmails, user }: { initialEmails: Email[], user?: User }) {
    const [emails, setEmails] = useState<Email[]>(initialEmails);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [filterRecipient, setFilterRecipient] = useState<string>('all');

    // Extract unique recipient emails
    const uniqueRecipients = useMemo(() => {
        const recipients = new Set(emails.map(e => e.recipient));
        return Array.from(recipients).sort();
    }, [emails]);

    // Filter emails based on selected recipient
    const filteredEmails = useMemo(() => {
        if (filterRecipient === 'all') return emails;
        return emails.filter(e => e.recipient === filterRecipient);
    }, [emails, filterRecipient]);

    const handleReply = async () => {
        if (!selectedEmail) return;
        setSending(true);
        const result = await sendReply(selectedEmail.id, selectedEmail.sender, selectedEmail.subject, replyText);
        setSending(false);
        if (result.success) {
            alert('Reply sent!');
            setReplyText('');
            // Update local state to show replied
            setEmails(emails.map(e => e.id === selectedEmail.id ? { ...e, replied: true } : e));
            setSelectedEmail({ ...selectedEmail, replied: true });
        } else {
            alert('Failed to send reply');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
            {/* Sidebar / List */}
            <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto flex flex-col shadow-sm z-10">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-xl text-gray-800">Inbox</div>
                        <div className="flex items-center gap-2">
                            {user?.image && (
                                <img
                                    src={user.image}
                                    alt={user.name || 'User'}
                                    className="w-8 h-8 rounded-full border border-gray-300"
                                />
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={user?.email ? `Sign out (${user.email})` : 'Sign out'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                    <select
                        value={filterRecipient}
                        onChange={(e) => setFilterRecipient(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    >
                        <option value="all">All Emails ({emails.length})</option>
                        {uniqueRecipients.map(recipient => {
                            const count = emails.filter(e => e.recipient === recipient).length;
                            return (
                                <option key={recipient} value={recipient}>
                                    {recipient} ({count})
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredEmails.map(email => (
                        <div
                            key={email.id}
                            onClick={() => setSelectedEmail(email)}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${selectedEmail?.id === email.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className={`font-semibold truncate ${selectedEmail?.id === email.id ? 'text-blue-900' : 'text-gray-900'}`}>{email.sender}</div>
                                <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {new Date(email.receivedAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className={`text-sm truncate mb-1 ${selectedEmail?.id === email.id ? 'text-blue-800' : 'text-gray-800'}`}>{email.subject}</div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                                    To: {email.recipient}
                                </div>
                                {email.replied && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                        <span>✓</span> Replied
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredEmails.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <div className="mb-2 text-4xl">📭</div>
                            <div>No emails found</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail View */}
            <div className="w-2/3 flex flex-col h-screen overflow-hidden bg-white">
                {selectedEmail ? (
                    <div className="flex flex-col h-full">
                        <div className="p-8 border-b border-gray-200 bg-gray-50 shadow-sm z-10">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 leading-tight">{selectedEmail.subject}</h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex">
                                    <span className="font-semibold w-16 text-gray-700">From:</span>
                                    <span className="text-gray-900">{selectedEmail.sender}</span>
                                </div>
                                <div className="flex">
                                    <span className="font-semibold w-16 text-gray-700">To:</span>
                                    <span className="text-gray-900">{selectedEmail.recipient}</span>
                                </div>
                                <div className="flex">
                                    <span className="font-semibold w-16 text-gray-700">Date:</span>
                                    <span className="text-gray-900">{new Date(selectedEmail.receivedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8 bg-white">
                            <div className="prose max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml || selectedEmail.bodyPlain }} />
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <h3 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                Reply
                            </h3>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg mb-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-sm resize-none"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleReply}
                                    disabled={sending || !replyText.trim()}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors flex items-center gap-2"
                                >
                                    {sending ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Reply
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                        <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><path d="M9 9h6"></path><path d="M9 13h6"></path><path d="M9 17h1"></path></svg>
                        </div>
                        <div className="text-lg font-medium text-gray-500">Select an email to view</div>
                    </div>
                )}
            </div>
        </div>
    );
}
