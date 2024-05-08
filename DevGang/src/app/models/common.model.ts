export interface ProjectResponse {
    projects: Project[];
}

export interface Project {
    _id: string;
    name: string;
    description: string;
    board: any; // Define more specifically if possible
    issues: any[]; // Define more specifically if possible
}
export interface IssueResponse{
  issues: Issue[];
}
export interface Issue{
  _id: String;
  summary: string;
  description?: string; 
  issueType: string;
  assignee?: string; 
  labels?: string[]; 
  parent?: string; 
  reporter?: string;
  status: string;
  projectId: string; 
  attachment?: string[];
}