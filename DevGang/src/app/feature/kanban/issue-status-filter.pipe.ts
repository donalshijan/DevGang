import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from './types';  // Adjust the import path according to your project structure

@Pipe({
    name: 'issueStatusFilter',
    standalone: true
})
export class IssueStatusFilterPipe implements PipeTransform {
    transform(issues: Issue[], status: string): Issue[] {
        return issues.filter(issue => issue.status === status);
    }
}
