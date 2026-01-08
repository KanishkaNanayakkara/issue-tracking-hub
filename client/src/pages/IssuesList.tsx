import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { IssueCard } from '@/components/issues/IssueCard';
import { IssueFiltersComponent } from '@/components/issues/IssueFilters';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useIssueStore } from '@/store/useIssueStore';
import { exportUtils } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';
import type { Issue, IssueFilters, IssueStatus, IssuePriority } from '@/types';
import {
    PlusCircle,
    Download,
    FileJson,
    FileSpreadsheet,
    ListTodo
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function IssuesListPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { toast } = useToast();

    const fetchIssues = useIssueStore((state) => state.fetchIssues);
    const filters = useIssueStore((state) => state.filters);
    const resetFilters = useIssueStore((state) => state.resetFilters);
    const deleteIssue = useIssueStore((state) => state.deleteIssue);
    const isLoading = useIssueStore((state) => state.loading);
    const filteredIssues = useIssueStore((state) => state.issues);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);

    useEffect(() => {
        const status = searchParams.get('status') as IssueStatus | 'all' | null;
        const priority = searchParams.get('priority') as IssuePriority | 'all' | null;
        const search = searchParams.get('search') || '';

        const initialFilters: Partial<IssueFilters> = {};
        if (status) initialFilters.status = status;
        if (priority) initialFilters.priority = priority;
        if (search) initialFilters.search = search;

        fetchIssues(initialFilters);
    }, []);

    const handleFiltersChange = useCallback((newFilters: Partial<IssueFilters>) => {
        fetchIssues(newFilters);

        setSearchParams((prevParams) => {
            const params = new URLSearchParams(prevParams);
            const currentFilters = { ...filters, ...newFilters };

            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value && value !== 'all' && value !== '') {
                    // @ts-ignore
                    params.set(key, value as string);
                } else {
                    params.delete(key);
                }
            });
            return params;
        }, { replace: true });
    }, [filters, fetchIssues, setSearchParams]);

    const handleResetFilters = useCallback(() => {
        resetFilters();
        fetchIssues(
            {
                search: '',
                status: 'all',
                priority: 'all'
            }
        );
        setSearchParams({}, { replace: true });
    }, [resetFilters, fetchIssues, setSearchParams]);

    const handleView = (issue: Issue) => {
        navigate(`/issues/${issue.id}`);
    };

    const handleEdit = (issue: Issue) => {
        navigate(`/issues/${issue.id}/edit`);
    };

    const handleDeleteClick = (issue: Issue) => {
        setIssueToDelete(issue);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (issueToDelete) {
            await deleteIssue(issueToDelete.id);
            toast({
                title: 'Issue deleted',
                description: `"${issueToDelete.title}" has been deleted.`,
            });
            setDeleteDialogOpen(false);
            setIssueToDelete(null);
        }
    };

    const handleExportCSV = () => {
        const csv = exportUtils.toCSV(filteredIssues);
        exportUtils.downloadFile(csv, 'issues.csv', 'text/csv');
        toast({
            title: 'Export complete',
            description: `${filteredIssues.length} issues exported to CSV.`,
        });
    };

    const handleExportJSON = () => {
        const json = exportUtils.toJSON(filteredIssues);
        exportUtils.downloadFile(json, 'issues.json', 'application/json');
        toast({
            title: 'Export complete',
            description: `${filteredIssues.length} issues exported to JSON.`,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Issues</h1>
                        <p className="text-muted-foreground mt-1">
                            {filteredIssues.length} issues
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleExportCSV}>
                                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                                    Export as CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportJSON}>
                                    <FileJson className="w-4 h-4 mr-2" />
                                    Export as JSON
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button onClick={() => navigate('/issues/new')}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            New Issue
                        </Button>
                    </div>
                </div>

                <IssueFiltersComponent
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onReset={handleResetFilters}
                />

                {isLoading ? (
                    <LoadingState message="Loading issues..." />
                ) : filteredIssues.length === 0 ? (
                    <EmptyState
                        title="No issues found"
                        description={
                            filters.search || filters.status !== 'all' || filters.priority !== 'all'
                                ? "Try adjusting your filters to find what you're looking for."
                                : "Get started by creating your first issue."
                        }
                        icon={<ListTodo className="w-8 h-8 text-muted-foreground" />}
                        action={
                            filters.search || filters.status !== 'all' || filters.priority !== 'all' ? (
                                <Button variant="outline" onClick={handleResetFilters}>
                                    Clear filters
                                </Button>
                            ) : (
                                <Button onClick={() => navigate('/issues/new')}>
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Create Issue
                                </Button>
                            )
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {filteredIssues.map((issue, index) => (
                            <div
                                key={issue.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <IssueCard
                                    issue={issue}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <ConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete Issue"
                    description={`Are you sure you want to delete "${issueToDelete?.title}"? This action cannot be undone.`}
                    confirmLabel="Delete"
                    variant="destructive"
                    onConfirm={handleDeleteConfirm}
                />
            </div>
        </AppLayout>
    );
}
