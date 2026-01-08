import type { Issue } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
    issue: Issue;
    onView: (issue: Issue) => void;
    onEdit: (issue: Issue) => void;
    onDelete: (issue: Issue) => void;
}

export function IssueCard({ issue, onView, onEdit, onDelete }: IssueCardProps) {
    return (
        <Card className="group hover:shadow-md transition-all duration-200 animate-fade-in">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Issue info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <StatusBadge status={issue.status} size="sm" />
                            <PriorityBadge priority={issue.priority} size="sm" />
                        </div>

                        <h3
                            className="text-base font-semibold text-foreground mb-1 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => onView(issue)}
                        >
                            {issue.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {issue.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>#{issue.id.substring(0, 8)}</span>
                            <span>•</span>
                            <span>Created {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
                            {issue.user && (
                                <>
                                    <span>•</span>
                                    <span>by {issue.user.name}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onView(issue)}
                            title="View issue"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onEdit(issue)}
                            title="Edit issue"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onDelete(issue)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete issue"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
