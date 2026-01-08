export interface User {
    id: string;
    email: string;
    name: string;
}

export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
// Alias for compatibility with issue-hub-frontend components
export type IssueStatus = Status;

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
// Alias for compatibility with issue-hub-frontend components
export type IssuePriority = Priority;

export type Severity = 'MINOR' | 'MAJOR' | 'CRITICAL';
export type IssueSeverity = Severity;


export interface Issue {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    severity?: Severity; // Optional as it might not be in backend yet
    createdAt: string;
    updatedAt: string;
    userId?: string;
    user?: User;
    createdBy?: string; // For compatibility
}

export interface AuthResponse {
    token: string;
    user: User;
}

// Filter types
export interface IssueFilters {
    search: string;
    status: IssueStatus | 'all';
    priority: IssuePriority | 'all';
    page: number;
    limit: number;
}
