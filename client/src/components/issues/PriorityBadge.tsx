import type { IssuePriority } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowRight, ArrowDown, AlertCircle } from 'lucide-react';

interface PriorityBadgeProps {
    priority: IssuePriority;
    showIcon?: boolean;
    size?: 'sm' | 'default';
}

const priorityConfig: Record<string, { label: string; variant: any; icon: any }> = {
    HIGH: {
        label: 'High',
        variant: 'high',
        icon: ArrowUp,
    },
    MEDIUM: {
        label: 'Medium',
        variant: 'medium',
        icon: ArrowRight,
    },
    LOW: {
        label: 'Low',
        variant: 'low',
        icon: ArrowDown,
    },
    CRITICAL: {
        label: 'Critical',
        variant: 'destructive',
        icon: AlertCircle,
    }
};

export function PriorityBadge({ priority, showIcon = true, size = 'default' }: PriorityBadgeProps) {
    const config = priorityConfig[priority] || priorityConfig['MEDIUM'];
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
