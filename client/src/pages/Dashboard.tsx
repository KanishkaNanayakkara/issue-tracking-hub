import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIssueStore } from '@/store/useIssueStore';
import {
    CircleDot,
    Clock,
    CheckCircle2,
    PlusCircle,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

export default function Dashboard() {
    const fetchIssues = useIssueStore((state) => state.fetchIssues);
    const issues = useIssueStore((state) => state.issues);

    const stats = useMemo(() => {
        return {
            total: issues.length,
            open: issues.filter((i) => i.status === 'OPEN').length,
            inProgress: issues.filter((i) => i.status === 'IN_PROGRESS').length,
            resolved: issues.filter((i) => i.status === 'RESOLVED').length,
        };
    }, [issues]);


    useEffect(() => {
        fetchIssues();

    }, []);

    const statCards = [
        {
            title: 'Open Issues',
            value: stats.open,
            icon: CircleDot,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            href: '/issues?status=OPEN',
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            icon: Clock,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            href: '/issues?status=IN_PROGRESS',
        },
        {
            title: 'Resolved',
            value: stats.resolved,
            icon: CheckCircle2,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            href: '/issues?status=RESOLVED',
        },
        {
            title: 'Total Issues',
            value: stats.total,
            icon: TrendingUp,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            href: '/issues',
        },
    ];

    // Get recent issues
    const recentIssues = issues.slice(0, 5);

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Overview of your issue tracking metrics
                        </p>
                    </div>
                    <Button asChild>
                        <Link to="/issues/new">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            New Issue
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <Link key={stat.title} to={stat.href}>
                            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                        <span>View details</span>
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Recent Issues */}
                <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Issues</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/issues">
                                View all
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentIssues.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No issues found. Create your first issue to get started.
                            </p>
                        ) : (
                            <div className="divide-y divide-border">
                                {recentIssues.map((issue) => (
                                    <Link
                                        key={issue.id}
                                        to={`/issues/${issue.id}`}
                                        className="flex items-center justify-between py-3 hover:bg-muted/50 -mx-4 px-4 transition-colors first:-mt-3 last:-mb-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-2 h-2 rounded-full ${issue.status === 'OPEN' ? 'bg-blue-500' :
                                                issue.status === 'IN_PROGRESS' ? 'bg-amber-500' :
                                                    'bg-green-500'
                                                }`} />
                                            <span className="font-medium truncate">{issue.title}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0 ml-4">
                                            #{issue.id.substring(0, 8)}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
