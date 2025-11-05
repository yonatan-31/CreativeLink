import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  projectId: mongoose.Types.ObjectId | null;
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'ProjectRequest',
      required: true,
    },
    lastMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ participants: 1 });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
