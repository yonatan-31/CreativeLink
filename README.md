# DesignConnect - Graphic Designer Marketplace

A modern digital marketplace connecting clients with talented graphic designers for branding, marketing, and UI/UX projects.

## 🎯 Features

### ✅ Completed Features

#### Authentication System
- **NextAuth.js** integration with email and Google OAuth
- User registration and login
- Session management
- Role-based access (Designer/Client)

#### Designer Features
- **Profile Creation**: Professional title, bio, category selection
- **Skills Management**: Tag-based skills system
- **Rate Setting**: Hourly rate configuration
- **Availability Status**: Available/Busy indicators
- **Portfolio Management**: Image upload and gallery (structure ready)
- **Project Request Management**: Accept/decline incoming requests
- **Dashboard**: Complete freelancer dashboard

#### Client Features
- **Designer Discovery**: Browse and filter designers by category, rate, skills
- **Profile Viewing**: Detailed designer profiles with portfolio
- **Project Requests**: Send project requests to designers
- **Request Tracking**: Monitor project request status
- **Dashboard**: Client-specific dashboard

#### Shared Features
- **Responsive Design**: Mobile and desktop optimized
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **Real-time Updates**: Dynamic content loading
- **Search & Filter**: Advanced filtering system

### 🚧 In Progress

#### Reviews & Ratings System
- Review submission after project completion
- Rating display and aggregation
- Review management

## 🛠 Tech Stack

### Frontend
- **Next.js 15** (App Router, SSR + SSG)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form + Zod** for form handling
- **Lucide React** for icons

### Backend
- **Next.js API Routes** (serverless functions)
- **Node.js** (built-in with Next.js)
- **MongoDB + Mongoose** for data persistence
- **NextAuth.js** for authentication

### Deployment Ready
- **Vercel** compatible
- **MongoDB Atlas** ready
- **Cloudinary** integration prepared

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── designers/                # Designer pages
│   │   ├── page.tsx             # Designer listing
│   │   └── [id]/page.tsx        # Individual designer profile
│   ├── dashboard/               # Dashboard pages
│   │   ├── page.tsx            # Main dashboard
│   │   ├── freelancer/page.tsx # Designer dashboard
│   │   └── client/page.tsx     # Client dashboard
│   └── auth/                   # Authentication pages
│       ├── signin/page.tsx     # Sign in
│       └── signup/page.tsx     # Sign up
├── components/                  # React components
│   ├── providers.tsx           # Session provider
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utilities
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # MongoDB connection
│   └── utils.ts                # Helper functions
├── models/                     # Database models
│   ├── user.ts                 # User model
│   ├── designerProfile.ts      # Designer profile model
│   ├── projectRequest.ts       # Project request model
│   └── review.ts               # Review model
└── pages/api/                  # API endpoints
    ├── auth/                   # Authentication APIs
    ├── designers/              # Designer APIs
    ├── projects/               # Project APIs
    └── reviews/                # Review APIs
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Google OAuth credentials (optional)
- Cloudinary account (for image uploads)

### Installation

1. **Clone and Install**
   ```bash
   cd designconnect
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```bash
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/designconnect?retryWrites=true&w=majority

   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Models

### User
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password?: string,
  role: "designer" | "client",
  avatarUrl?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### DesignerProfile
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  bio: string,
  category: "Brand & Identity" | "UI/UX" | "Marketing & Advertising" | "Packaging" | "Illustration",
  skills: string[],
  rate: number,
  availability: "available" | "busy",
  portfolio: [{ url: string, title: string, description: string }],
  ratingAvg: number,
  reviewsCount: number,
  createdAt: Date,
  updatedAt: Date
}
```

### ProjectRequest
```typescript
{
  _id: ObjectId,
  clientId: ObjectId,
  designerId: ObjectId,
  title: string,
  description: string,
  budget: number,
  status: "pending" | "accepted" | "declined" | "completed",
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```typescript
{
  _id: ObjectId,
  projectId: ObjectId,
  clientId: ObjectId,
  designerId: ObjectId,
  rating: number (1-5),
  comment: string,
  createdAt: Date
}
```

## 🎨 Design Categories

1. **Brand & Identity** - Logo design, brand guidelines, visual identity
2. **UI/UX Design** - User interface and user experience design
3. **Marketing & Advertising** - Marketing materials, social media graphics
4. **Packaging** - Product packaging design
5. **Illustration** - Custom illustrations and graphics

## 🔐 Authentication Flow

1. **Registration**: Users sign up as either Designer or Client
2. **Login**: Email/password or Google OAuth
3. **Role-based Access**: Different dashboards based on user role
4. **Session Management**: Secure JWT-based sessions

## 📱 Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** for consistent styling
- **Touch-friendly** interfaces
- **Optimized** for all screen sizes

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string and add to environment variables
3. Whitelist your deployment IP addresses

## 🎯 Next Steps

### Immediate Enhancements
- [ ] Complete reviews and ratings system
- [ ] Add image upload functionality
- [ ] Implement messaging system
- [ ] Add portfolio image management
- [ ] Enhanced search and filtering

### Future Features
- [ ] Payment integration
- [ ] Project milestone tracking
- [ ] File sharing system
- [ ] Advanced analytics
- [ ] Mobile app development

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**DesignConnect** - Connecting creativity with opportunity. 🎨✨