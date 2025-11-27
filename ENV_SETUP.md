# Quick Start: Environment Variables

Add these to your `.env` file to get started:

```bash
# Mailjet Configuration (already configured)
MAILJET_API_KEY=dcf4fc910de19194ea87f064fa12d36b
MAILJET_API_SECRET=c5a13b86043a77136c83b9b44b05634e
SENDER_EMAIL=support@keywords.chat

# Google OAuth Configuration (YOU NEED TO SET THESE)
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_FROM_GOOGLE_CLOUD_CONSOLE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_FROM_GOOGLE_CLOUD_CONSOLE

# NextAuth Configuration
NEXTAUTH_SECRET=xrcHfD71RG8Acy3KXkXwFQ+Ka5fbYcK39ldEwa3zmRw=
NEXTAUTH_URL=http://localhost:3000

# Allowed email addresses (comma-separated)
# Replace with your actual email address(es)
ALLOWED_EMAILS=your-email@gmail.com
```

## Next Steps:

1. **Get Google OAuth credentials**: Follow the steps in [`OAUTH_SETUP.md`](./OAUTH_SETUP.md) to create OAuth credentials in Google Cloud Console

2. **Update your `.env` file** with the values above (replace `YOUR_CLIENT_ID_FROM_GOOGLE_CLOUD_CONSOLE`, `YOUR_CLIENT_SECRET_FROM_GOOGLE_CLOUD_CONSOLE`, and `your-email@gmail.com`)

3. **Test locally**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 - you should be redirected to sign in with Google

4. **Deploy to production**: Update the environment variables in Cloud Run (see [`OAUTH_SETUP.md`](./OAUTH_SETUP.md) Step 4)
