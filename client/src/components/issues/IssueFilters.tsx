import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { IssueFilters, IssueStatus, IssuePriority } from '@/types';

interface IssueFiltersProps {
    filters: IssueFilters;
    onFiltersChange: (filters: Partial<IssueFilters>) => void;
    onReset: () => void;
}

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function IssueFiltersComponent({ filters, onFiltersChange, onReset }: IssueFiltersProps) {
    const [searchInput, setSearchInput] = useState(filters.search);
    const debouncedSearch = useDebounce(searchInput, 300);

    // Update filters when debounced search changes
    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            onFiltersChange({ search: debouncedSearch });
        }
    }, [debouncedSearch, filters.search, onFiltersChange]);

    const hasActiveFilters = filters.search || filters.status !== 'all' || filters.priority !== 'all';

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search issues..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 pr-10"
                />
                {searchInput && (
                    <div
                        onClick={() => setSearchInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </div>
                )}
            </div>

            {/* Status filter */}
            <Select
                value={filters.status}
                onValueChange={(value) => onFiltersChange({ status: value as IssueStatus | 'all' })}
            >
                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
            </Select>

            {/* Priority filter */}
            <Select
                value={filters.priority}
                onValueChange={(value) => onFiltersChange({ priority: value as IssuePriority | 'all' })}
            >
                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
            </Select>

            {/* Reset filters */}
            {hasActiveFilters && (
                <Button variant="outline" onClick={() => {
                    setSearchInput('');
                    onReset();
                }} className="gap-2">
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear</span>
                </Button>
            )}
        </div>
    );
}
