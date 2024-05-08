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