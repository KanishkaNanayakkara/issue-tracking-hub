import { create } from 'zustand';
import api from '../api/axios';
import type { Issue, IssueFilters } from '../types';

interface IssueState {
    issues: Issue[];
    selectedIssue: Issue | null;
    filters: IssueFilters;
    loading: boolean;
    error: string | null;
    totalCount: number;

    // Actions
    fetchIssues: (filters?: Partial<IssueFilters>) => Promise<void>;
    createIssue: (data: Partial<Issue>) => Promise<void>;
    updateIssue: (id: string, data: Partial<Issue>) => Promise<void>;
    deleteIssue: (id: string) => Promise<void>;
    setSelectedIssue: (issue: Issue | null) => void;
    setFilters: (filters: Partial<IssueFilters>) => void;
    resetFilters: () => void;
}

const defaultFilters: IssueFilters = {
    search: '',
    status: 'all',
    priority: 'all',
    page: 1,
    limit: 10,
};

export const useIssueStore = create<IssueState>((set, get) => ({
    issues: [],
    selectedIssue: null,
    filters: defaultFilters,
    loading: false,
    error: null,
    totalCount: 0,

    fetchIssues: async (newFilters) => {
        set({ loading: true, error: null });
        const currentFilters = { ...get().filters, ...newFilters };
        if (newFilters) {
            set({ filters: currentFilters });
        }

        try {
            const params = new URLSearchParams();
            if (currentFilters.status && currentFilters.status !== 'all') params.append('status', currentFilters.status);
            if (currentFilters.priority && currentFilters.priority !== 'all') params.append('priority', currentFilters.priority);
            if (currentFilters.search) params.append('search', currentFilters.search);

            const res = await api.get(`/issues?${params.toString()}`);
            set({ issues: res.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.error || 'Failed to fetch', loading: false });
        }
    },
    createIssue: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/issues', data);
            set((state) => ({ issues: [res.data, ...state.issues], loading: false }));
        } catch (err: any) {
            set({ error: err.response?.data?.error || 'Failed to create', loading: false });
        }
    },
    updateIssue: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/issues/${id}`, data);
            set((state) => ({
                issues: state.issues.map((i) => (i.id === id ? res.data : i)),
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.response?.data?.error || 'Failed to update', loading: false });
        }
    },
    deleteIssue: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/issues/${id}`);
            set((state) => ({
                issues: state.issues.filter((i) => i.id !== id),
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.response?.data?.error || 'Failed to delete', loading: false });
        }
    },
    setSelectedIssue: (issue) => set({ selectedIssue: issue }),
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
    resetFilters: () => set({ filters: defaultFilters }),
}));

// Selectors
// Issues are stored already filtered by the API call in fetchIssues.
// Granular state selection is recommended for performance.
