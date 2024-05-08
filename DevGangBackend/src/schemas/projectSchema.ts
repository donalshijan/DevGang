import { Schema } from "mongoose";
import { ProjectType } from "../types/project.types";
import { boardSchema } from "./boardSchema";
import { issueSchema } from "./issueSchema";

export const projectSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    board: { type: boardSchema, required: false }, 
    issues: [{ type: issueSchema }],
  });