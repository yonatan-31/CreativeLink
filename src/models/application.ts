import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  clientProjectId: mongoose.Types.ObjectId;
  designerId: mongoose.Types.ObjectId;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    clientProjectId: { type: Schema.Types.ObjectId, ref: 'ClientProjects', required: true },
    designerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: { type: String, required: true, maxlength: 3000 },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

ApplicationSchema.index({ clientProjectId: 1 });
ApplicationSchema.index({ designerId: 1 });

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
