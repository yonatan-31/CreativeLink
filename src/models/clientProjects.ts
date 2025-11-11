import mongoose, { Document, Schema } from 'mongoose';

export interface IClientProject extends Document {
  clientId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  category?: string;
  deadline?: Date;
  status: 'open' | 'closed' | 'in_progress';
  createdAt: Date;
  updatedAt: Date;
}

const ClientProjectSchema = new Schema<IClientProject>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    budget: { type: Number, required: true, min: 0 },
    category: { type: String },
    deadline: { type: Date },
    status: { type: String, enum: ['open', 'closed', 'in_progress'], default: 'open' },
  },
  { timestamps: true }
);

ClientProjectSchema.index({ clientId: 1 });
ClientProjectSchema.index({ status: 1 });

export default mongoose.models.ClientProjects || mongoose.model<IClientProject>('ClientProjects', ClientProjectSchema);
