import mongoose, { Types } from 'mongoose';
import { issueSchema } from '../schemas/issueSchema';
import Project from './Project';
import { ProjectType } from '../types/project.types';
import User from './User';


export interface IIssue extends Document{
    summary: string;
    description?: string; // Optional property
    issueType: string;
    assignee?: Types.ObjectId; // Optional property
    labels?: string[]; // Array of strings
    parent?: Types.ObjectId; // Optional property
    reporter?: Types.ObjectId;
    status: string;
    projectId: Types.ObjectId; // Reference to the project ID
    attachment?: string[];
}

// Define the Issue model
const Issue = mongoose.model<IIssue>('Issue', issueSchema)
// Function to create an issue
export const createIssue = async (issueData: IIssue,username:string): Promise<IIssue> => {
    try {
        // Create a new issue using the provided data
        
        const project = await Project.findById(issueData.projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        const user : any = await User.findOne({username:username})
        issueData.reporter=user._id
        const newIssue = await Issue.create(issueData);
        if (!project.issues) {
            project.issues = [];
        }
        // Add the newly created issue to the issues array of the project
        project.issues.push(newIssue);
        
        // Save the updated project document
        await project.save();
        return newIssue;
    } catch (error) {
        // Handle errors
        const err = error as Error;
        throw new Error('Failed to create issue: ' + err.message);
    }
};

export default Issue;
