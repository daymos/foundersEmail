# Google OAuth Setup Guide

Follow these steps to set up Google OAuth authentication for your email dashboard.

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - User Type: **External** (or Internal if using Google Workspace)
   - App name: `Email Dashboard`
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: No need to add any (default is fine)
   - Test users: Add your email address
6. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Email Dashboard`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://emailer-84818240112.us-central1.run.app` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://emailer-84818240112.us-central1.run.app/api/auth/callback/google`
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

## Step 2: Generate NextAuth Secret

Run this command to generate a random secret:

```bash
openssl rand -base64 32
```

Copy the output - you'll use this as `NEXTAUTH_SECRET`.

## Step 3: Update Environment Variables

Add these to your `.env` file:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-from-step-1
GOOGLE_CLIENT_SECRET=your-client-secret-from-step-1

# NextAuth Configuration
NEXTAUTH_SECRET=your-random-secret-from-step-2
NEXTAUTH_URL=http://localhost:3000

# Allowed email addresses (comma-separated)
ALLOWED_EMAILS=your-email@gmail.com,another-email@gmail.com
```

## Step 4: Update Production Environment Variables

For Cloud Run deployment, set these environment variables:

```bash
gcloud run services update emailer \
  --region=us-central1 \
  --update-env-vars="GOOGLE_CLIENT_ID=your-client-id" \
  --update-env-vars="GOOGLE_CLIENT_SECRET=your-client-secret" \
  --update-env-vars="NEXTAUTH_SECRET=your-random-secret" \
  --update-env-vars="NEXTAUTH_URL=https://emailer-84818240112.us-central1.run.app" \
  --update-env-vars="ALLOWED_EMAILS=your-email@gmail.com"
```

Or update via the Cloud Run console:
1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your service
3. Click **Edit & Deploy New Revision**
4. Go to **Variables & Secrets** tab
5. Add the environment variables listed above
6. Click **Deploy**

## Step 5: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and you should be redirected to sign in with Google.

## Step 6: Deploy to Production

After testing locally, deploy to Cloud Run:

```bash
# Build and deploy
gcloud run deploy emailer \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated
```

## Troubleshooting

### "Access Denied" Error
- Make sure your email is in the `ALLOWED_EMAILS` list
- Check that the environment variable is set correctly (no extra spaces)

### "Redirect URI Mismatch" Error
- Verify the redirect URIs in Google Cloud Console match exactly:
  - `http://localhost:3000/api/auth/callback/google` (local)
  - `https://emailer-84818240112.us-central1.run.app/api/auth/callback/google` (production)

### Session Not Persisting
- Make sure `NEXTAUTH_SECRET` is set and is a long random string
- Verify `NEXTAUTH_URL` matches your current environment
