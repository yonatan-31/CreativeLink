# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/designconnect?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Setup Instructions:

1. **MongoDB Atlas**: Create a free cluster at https://cloud.mongodb.com
2. **Google OAuth**: Set up OAuth credentials at https://console.cloud.google.com
3. **Cloudinary**: Create a free account at https://cloudinary.com
4. **NextAuth Secret**: Generate a random string for NEXTAUTH_SECRET

