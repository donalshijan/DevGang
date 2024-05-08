import { Schema } from "mongoose";

export const issueSchema: Schema = new Schema({
    summary: { type: String, required: true },
    description: { type: String, required: false },
    issueType: { type: String, required: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Assuming 'User' is the model name for users
    labels: [{ type: String }], // Array of labels
    parent: { type: Schema.Types.ObjectId, ref: 'Issue', required: false }, // Reference to parent issue
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the reporter (user who created the issue)
    status: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to the project to which the issue belongs
    attachment: [{ type: String }], // URL or file path for attachments
  });