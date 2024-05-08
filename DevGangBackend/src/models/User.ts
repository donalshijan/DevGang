import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { ProjectType } from '../types/project.types';
import Project from './Project';
import { userSchema } from '../schemas/userSchema';
// Interface to define the User Document properties


export interface IUser extends Document {
  username: string;
  password: string;
  Projects: Types.ObjectId[];
  comparePassword: (password: string, callback: (err: any, isMatch: boolean) => void) => void;
  createProject: (projectData: ProjectType) => Promise<String>;
  getProjects: () => Promise<ProjectType[]>;
}

// Pre-save hook to hash password before saving to the database
userSchema.pre<IUser>('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  next();
});

export const createUser = async (userData: { username: string, password: string }): Promise<IUser> => {
  try {
      // Create a new user instance using the provided data
      const newUser = new User(userData);

      // Save the new user to the database
      const savedUser = await newUser.save();

      return savedUser;
  } catch (error) {
      const err = error as Error;
      throw new Error('Failed to create user: ' + err.message);
  }
};

// Method to compare password for login
userSchema.methods.comparePassword = function(password: string, callback: (err: any, isMatch: boolean) => void) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return callback(err, false);
    callback(null, isMatch);
  });
};

userSchema.statics.findUserByUsername = async function(username: string): Promise<IUser | null> {
  try {
    const user = await this.findOne({ username }).exec();
    return user; // This will return either the user document or null if not found
  } catch (error) {
    // Handle error
    console.error('Error finding user by username:', error);
    return null;
  }
};
userSchema.methods.createProject = async function(projectData: ProjectType): Promise<String> {
  // Create a new project instance using the provided data
  const newProject = new Project(projectData);
  
  try {
    // Save the new project to the database
    await newProject.save();
    
    // Add the newly created project's Id to the user's list of projects
    this.Projects.push(newProject._id);
    
    // Save the updated user document
    await this.save();
    return newProject._id.toString()
  } catch (error) {
    const err = error as Error;
    throw new Error('Failed to create project: ' + err.message);
  }
};

userSchema.methods.getProjects = async function(): Promise<ProjectType[]> {
  try {
    // Get the project ids from the Projects field of the user document
    const projectIds = this.Projects as Types.ObjectId[];

    // Fetch the projects from the projects collection based on the project ids
    const projects = await Project.find({ _id: { $in: projectIds } });
    return projects;
  } catch (error) {
    const err = error as Error;
    throw new Error('Failed to get projects: ' + err.message);
  }
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
