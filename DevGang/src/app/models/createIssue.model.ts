export interface Issue{
    summary: string;
    description?: string; // Optional property
    issueType: string;
    assignee?: string; // Optional property
    labels?: string[]; // Array of strings
    parent?: string // Optional property
    reporter?: string;
    status: string;
    projectId: string; // Reference to the project ID
    attachment?: string[];
}