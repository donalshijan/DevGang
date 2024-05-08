export interface Project {
    _id: string;
    name: string;
    description: string;
    board: any; // Define more specifically if possible
    issues: any[]; // Define more specifically if possible
}