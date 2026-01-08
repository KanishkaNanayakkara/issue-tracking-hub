import type { Issue } from "@/types";

// Export utilities for CSV/JSON export
export const exportUtils = {
    toJSON: (issues: Issue[]): string => {
        return JSON.stringify(issues, null, 2);
    },

    toCSV: (issues: Issue[]): string => {
        const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Created At', 'Updated At'];
        const rows = issues.map((issue) => [
            issue.id,
            `"${issue.title.replace(/"/g, '""')}"`,
            `"${issue.description.replace(/"/g, '""')}"`,
            issue.status,
            issue.priority,
            issue.createdAt,
            issue.updatedAt,
        ]);

        return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    },

    downloadFile: (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
};
