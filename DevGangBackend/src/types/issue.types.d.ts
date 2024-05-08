import { Document, Types } from "mongoose";

export interface IssueType {
    summary: string;
    description?: string; // Optional property
    issueType: string;
    assignee?: Types.ObjectId|String; // Optional property
    labels?: string[]; // Array of strings
    parent?: Types.ObjectId|String; // Optional property
    reporter: Types.ObjectId|string;
    status: string;
    projectId: Types.ObjectId|string; // Reference to the project ID
    attachment?: string[];
}