import type { IssueStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CircleDot, Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
    status: IssueStatus;
    showIcon?: boolean;
    size?: 'sm' | 'default';
}

const statusConfig: Record<string, { label: string; variant: any; icon: any }> = {
    OPEN: {
        label: 'Open',
        variant: 'open',
        icon: CircleDot,
    },
    IN_PROGRESS: {
        label: 'In Progress',
        variant: 'in-progress',
        icon: Clock,
    },
    RESOLVED: {
        label: 'Resolved',
        variant: 'resolved',
        icon: CheckCircle2,
    },
    CLOSED: {
        label: 'Closed',
        variant: 'secondary',
        icon: CheckCircle2,
    }
};

export function StatusBadge({ status, showIcon = true, size = 'default' }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig['OPEN'];
    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={size === 'sm' ? 'text-[10px] px-2 py-0.5' : ''}
        >
            {showIcon && <Icon className={`mr-1 ${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />}
            {config.label}
        </Badge>
    );
}
