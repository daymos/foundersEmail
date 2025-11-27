import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // Check if user email is in the allowed list
            const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map(e => e.trim()) || [];

            if (allowedEmails.length === 0) {
                console.warn('No ALLOWED_EMAILS configured - allowing all users');
                return true;
            }

            if (user.email && allowedEmails.includes(user.email)) {
                return true;
            }

            console.log(`Access denied for email: ${user.email}`);
            return false;
        },
        async session({ session, token }) {
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
})
