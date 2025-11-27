#!/bin/bash

# This script updates your .env file with the OAuth credentials
# Run with: bash update_env.sh YOUR_EMAIL@gmail.com

if [ -z "$1" ]; then
  echo "Usage: bash update_env.sh YOUR_EMAIL@gmail.com"
  exit 1
fi

ALLOWED_EMAIL=$1

cat > .env << 'EOF'
# Mailjet Configuration
MAILJET_API_KEY=dcf4fc910de19194ea87f064fa12d36b
MAILJET_API_SECRET=c5a13b86043a77136c83b9b44b05634e
SENDER_EMAIL=support@keywords.chat

# Google OAuth Configuration
GOOGLE_CLIENT_ID=84818240112-f4156pt4pqu3elj468ikmg8a1v7oi8h4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# NextAuth Configuration
NEXTAUTH_SECRET=xrcHfD71RG8Acy3KXkXwFQ+Ka5fbYcK39ldEwa3zmRw=
NEXTAUTH_URL=http://localhost:3000

# Allowed email addresses (comma-separated)
ALLOWED_EMAILS=${ALLOWED_EMAIL}
EOF

echo "✅ .env file updated successfully!"
echo "📧 Allowed email: ${ALLOWED_EMAIL}"
echo ""
echo "Next steps:"
echo "1. Restart your dev server (Ctrl+C and run 'npm run dev' again)"
echo "2. Visit http://localhost:3000"
echo "3. Sign in with your Google account"
