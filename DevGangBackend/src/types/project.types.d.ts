import { BoardType } from "./board.types";
import { IssueType } from "./issue.types";
import {Issue} from "../models/Issue";
// Define the Project type
export interface ProjectType {
    name: string;
    description: string;
    board?: BoardType;
    issues?: Issue[];

    // Add any other properties related to a project
}
