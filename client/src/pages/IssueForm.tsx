import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { IssueFormComponent } from '@/components/issues/IssueForm';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { useIssueStore } from '@/store/useIssueStore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import type { Issue } from '@/types';
import api from '@/api/axios';

export function IssueForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const createIssue = useIssueStore((state) => state.createIssue);
    const updateIssue = useIssueStore((state) => state.updateIssue);
    const { toast } = useToast();

    const [issue, setIssue] = useState<Issue | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            // Fetch issue details for editing if not in store?
            // We can use api directly or store. Store might not have it if we refreshed.
            api.get<Issue>(`/issues/${id}`)
                .then(res => {
                    setIssue(res.data);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError(err.message || 'Failed to fetch issue');
                    setIsLoading(false);
                });
        }
    }, [id]);

    const handleSubmit = async (data: any) => {
        try {
            if (id) {
                await updateIssue(id, data);
                toast({
                    title: 'Issue updated',
                    description: `"${data.title}" has been updated successfully.`,
                });
                navigate(`/issues/${id}`);
            } else {
                await createIssue(data);
                toast({
                    title: 'Issue created',
                    description: `"${data.title}" has been created successfully.`,
                });
                navigate('/issues');
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to save issue.',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <AppLayout>
                <LoadingState message="Loading issue..." />
            </AppLayout>
        );
    }

    if (id && error) {
        return (
            <AppLayout>
                <ErrorState
                    title="Issue not found"
                    message={error}
                    onRetry={() => navigate('/issues')}
                />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-2xl">
                {/* Back button */}
                <Button variant="ghost" onClick={() => navigate('/issues')} className="gap-2 -ml-2 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Issues
                </Button>

                <IssueFormComponent issue={issue} onSubmit={handleSubmit} />
            </div>
        </AppLayout>
    );
}
