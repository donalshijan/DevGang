// projectModel.ts
import mongoose from 'mongoose';
import { ProjectType } from '../types/project.types';
import { projectSchema } from '../schemas/projectSchema';


const Project = mongoose.model<ProjectType>('Project', projectSchema);

export default Project;
