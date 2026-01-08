import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Issue, IssueStatus, IssuePriority, Severity } from '@/types';
import { Loader2 } from 'lucide-react';

// Form validation schema
const issueSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    description: z.string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const),
    severity: z.enum(['MINOR', 'MAJOR', 'CRITICAL'] as const).optional(),
});

type IssueFormData = z.infer<typeof issueSchema>;

interface IssueFormProps {
    issue?: Issue;
    onSubmit: (data: IssueFormData) => Promise<void>;
    isLoading?: boolean;
}

export function IssueFormComponent({ issue, onSubmit, isLoading }: IssueFormProps) {
    const navigate = useNavigate();
    const isEditing = !!issue;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IssueFormData>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            title: issue?.title || '',
            description: issue?.description || '',
            status: issue?.status || 'OPEN',
            priority: issue?.priority || 'MEDIUM',
            severity: issue?.severity || 'MAJOR',
        },
    });

    const status = watch('status');
    const priority = watch('priority');
    const severity = watch('severity');

    const handleFormSubmit = async (data: IssueFormData) => {
        await onSubmit(data);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Issue' : 'Create New Issue'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="Brief description of the issue"
                            {...register('title')}
                            className={errors.title ? 'border-destructive' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Detailed description of the issue, steps to reproduce, expected behavior..."
                            rows={6}
                            {...register('description')}
                            className={errors.description ? 'border-destructive' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Status, Priority, Severity row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={status}
                                onValueChange={(value) => setValue('status', value as IssueStatus)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">Open</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={priority}
                                onValueChange={(value) => setValue('priority', value as IssuePriority)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="CRITICAL">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Severity */}
                        <div className="space-y-2">
                            <Label htmlFor="severity">Severity</Label>
                            <Select
                                value={severity}
                                onValueChange={(value) => setValue('severity', value as Severity)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MINOR">Minor</SelectItem>
                                    <SelectItem value="MAJOR">Major</SelectItem>
                                    <SelectItem value="CRITICAL">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditing ? 'Update Issue' : 'Create Issue'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
