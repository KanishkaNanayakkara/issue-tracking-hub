import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/issues/StatusBadge';
import { PriorityBadge } from '@/components/issues/PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { useIssueStore } from '@/store/useIssueStore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    CheckCircle2,
    Calendar,
    User,
    AlertTriangle
} from 'lucide-react';
import type { IssueStatus } from '@/types';
import api from '@/api/axios';
import type { Issue } from '@/types';

export function IssueDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const deleteIssue = useIssueStore((state) => state.deleteIssue);
    const updateIssue = useIssueStore((state) => state.updateIssue);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<IssueStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            api.get<Issue>(`/issues/${id}`)
                .then(res => {
                    setSelectedIssue(res.data);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError(err.message || 'Failed to fetch issue');
                    setIsLoading(false);
                });
        }
    }, [id]);

    const handleDelete = async () => {
        if (selectedIssue) {
            await deleteIssue(selectedIssue.id);
            toast({
                title: 'Issue deleted',
                description: `"${selectedIssue.title}" has been deleted.`,
            });
            navigate('/issues');
        }
    };

    const handleStatusChange = (status: IssueStatus) => {
        setNewStatus(status);
        setStatusDialogOpen(true);
    };

    const confirmStatusChange = async () => {
        if (selectedIssue && newStatus) {
            await updateIssue(selectedIssue.id, { status: newStatus });
            setSelectedIssue({ ...selectedIssue, status: newStatus }); // Optimistic update
            toast({
                title: 'Status updated',
                description: `Issue marked as ${newStatus}.`,
            });
            setStatusDialogOpen(false);
            setNewStatus(null);
        }
    };

    if (isLoading) {
        return (
            <AppLayout>
                <LoadingState message="Loading issue details..." />
            </AppLayout>
        );
    }

    if (!selectedIssue) {
        return (
            <AppLayout>
                <ErrorState
                    title="Issue not found"
                    message={error || "The issue you're looking for doesn't exist or has been deleted."}
                    onRetry={() => navigate('/issues')}
                />
            </AppLayout>
        );
    }

    const severityColors = {
        MINOR: 'bg-muted text-muted-foreground',
        MAJOR: 'bg-orange-500/10 text-orange-500',
        CRITICAL: 'bg-red-500/10 text-red-500',
    };

    return (
        <AppLayout>
            <div className="space-y-6 max-w-4xl">
                {/* Back button */}
                <Button variant="ghost" onClick={() => navigate('/issues')} className="gap-2 -ml-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Issues
                </Button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={selectedIssue.status} />
                            <PriorityBadge priority={selectedIssue.priority} />
                            {selectedIssue.severity && (
                                <Badge className={severityColors[selectedIssue.severity] || severityColors.MAJOR}>
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {selectedIssue.severity}
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold">{selectedIssue.title}</h1>
                        <p className="text-muted-foreground">Issue #{selectedIssue.id.substring(0, 8)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => navigate(`/issues/${id}/edit`)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(true)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main content */}
                    <Card className="md:col-span-2 animate-slide-up">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                                {selectedIssue.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Details card */}
                        <Card className="animate-slide-up" style={{ animationDelay: '50ms' }}>
                            <CardHeader>
                                <CardTitle className="text-base">Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground">Created</p>
                                        <p className="font-medium">{format(new Date(selectedIssue.createdAt), 'MMM d, yyyy h:mm a')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground">Last updated</p>
                                        <p className="font-medium">{format(new Date(selectedIssue.updatedAt), 'MMM d, yyyy h:mm a')}</p>
                                    </div>
                                </div>
                                {selectedIssue.user && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">Created by</p>
                                            <p className="font-medium">{selectedIssue.user.name}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions card */}
                        {selectedIssue.status !== 'RESOLVED' && selectedIssue.status !== 'CLOSED' && (
                            <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                                <CardHeader>
                                    <CardTitle className="text-base">Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        variant="default"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => handleStatusChange('RESOLVED')}
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Mark as Resolved
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Delete Dialog */}
                <ConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete Issue"
                    description={`Are you sure you want to delete "${selectedIssue.title}"? This action cannot be undone.`}
                    confirmLabel="Delete"
                    variant="destructive"
                    onConfirm={handleDelete}
                />

                {/* Status Change Dialog */}
                <ConfirmDialog
                    open={statusDialogOpen}
                    onOpenChange={setStatusDialogOpen}
                    title="Update Status"
                    description={`Are you sure you want to mark this issue as ${newStatus}?`}
                    confirmLabel="Confirm"
                    onConfirm={confirmStatusChange}
                />
            </div>
        </AppLayout>
    );
}
