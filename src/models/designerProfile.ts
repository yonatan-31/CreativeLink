import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioItem {
  url: string;
  publicId: string;
  title: string;
  description: string;
}

export interface IDesignerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  bio: string;
  category: 'Brand & Identity' | 'UI/UX' | 'Marketing & Advertising' | 'Packaging' | 'Illustration';
  skills: string[];
  rate: number;
  availability: 'available' | 'busy';
  portfolio: IPortfolioItem[];
  ratingAvg: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DesignerProfileSchema = new Schema<IDesignerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['Brand & Identity', 'UI/UX', 'Marketing & Advertising', 'Packaging', 'Illustration'],
      required: [true, 'Category is required'],
    },
    skills: [{
      type: String,
      trim: true,
    }],
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
      min: [0, 'Rate cannot be negative'],
    },
    availability: {
      type: String,
      enum: ['available', 'busy'],
      default: 'available',
    },
    portfolio: [{
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
    }],
    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
DesignerProfileSchema.index({ category: 1 });
DesignerProfileSchema.index({ skills: 1 });
DesignerProfileSchema.index({ rate: 1 });
DesignerProfileSchema.index({ availability: 1 });

export default mongoose.models.DesignerProfile || mongoose.model<IDesignerProfile>('DesignerProfile', DesignerProfileSchema);

