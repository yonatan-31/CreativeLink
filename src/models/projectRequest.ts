// import mongoose, { Document, Schema } from 'mongoose';

// export interface IProjectRequest extends Document {
//   clientId: mongoose.Types.ObjectId;
//   designerId: mongoose.Types.ObjectId;
//   title: string;
//   description: string;
//   budget: number;
//   status: 'pending' | 'accepted' | 'declined' | 'completed';
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ProjectRequestSchema = new Schema<IProjectRequest>(
//   {
//     clientId: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     designerId: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     title: {
//       type: String,
//       required: [true, 'Project title is required'],
//       trim: true,
//       maxlength: [100, 'Title cannot exceed 100 characters'],
//     },
//     description: {
//       type: String,
//       required: [true, 'Project description is required'],
//       maxlength: [1000, 'Description cannot exceed 1000 characters'],
//     },
//     budget: {
//       type: Number,
//       required: [true, 'Budget is required'],
//       min: [0, 'Budget cannot be negative'],
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'accepted', 'declined', 'completed'],
//       default: 'pending',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Index for better query performance
// ProjectRequestSchema.index({ clientId: 1 });
// ProjectRequestSchema.index({ designerId: 1 });
// ProjectRequestSchema.index({ status: 1 });

// export default mongoose.models.ProjectRequest || mongoose.model<IProjectRequest>('ProjectRequest', ProjectRequestSchema);

