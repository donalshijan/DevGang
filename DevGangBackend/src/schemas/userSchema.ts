import { Schema } from "mongoose";

export const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
  });
  