import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function DataTable({
    columns,
    rows,
    getRowKey,
    routeName,
    filters,
    searchPlaceholder = 'Cari data...',
    filterOptions = [],
    perPageOptions = [10, 25, 50],
    pagination,
    emptyMessage = 'Data tidak ditemukan.',
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                applyFilters({ search, page: 1 });
            }
        }, 350);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const normalizedPerPageOptions = useMemo(() => (
        [...new Set([...(perPageOptions || []), Number(filters.per_page || 10)])]
            .filter((value) => Number.isFinite(value) && value > 0)
            .sort((a, b) => a - b)
    ), [filters.per_page, perPageOptions]);

    const applyFilters = (updates = {}) => {
        const nextParams = {
            ...filters,
            ...updates,
        };

        Object.keys(nextParams).forEach((key) => {
            if (nextParams[key] === '' || nextParams[key] === null || nextParams[key] === undefined) {
                delete nextParams[key];
            }
        });

        router.get(route(routeName), nextParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="space-y-4 rounded-lg bg-white p-4 shadow">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                        <input
                            type="text"
                            className="w-full rounded border-gray-300 text-sm"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    {filterOptions.map((filter) => (
                        <div key={filter.key}>
                            <label className="mb-1 block text-sm font-medium text-gray-700">{filter.label}</label>
                            <select
                                className="w-full rounded border-gray-300 text-sm"
                                value={filters[filter.key] ?? ''}
                                onChange={(event) => applyFilters({ [filter.key]: event.target.value, page: 1 })}
                            >
                                <option value="">{filter.placeholder ?? `Semua ${filter.label}`}</option>
                                {filter.options.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Per halaman</label>
                    <select
                        className="w-full rounded border-gray-300 text-sm md:w-28"
                        value={filters.per_page ?? 10}
                        onChange={(event) => applyFilters({ per_page: event.target.value, page: 1 })}
                    >
                        {normalizedPerPageOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            {columns.map((column) => (
                                <th key={column.key} className="px-4 py-2">{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-gray-500" colSpan={columns.length}>
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : rows.map((row) => (
                            <tr key={getRowKey(row)} className="border-t">
                                {columns.map((column) => (
                                    <td key={`${getRowKey(row)}-${column.key}`} className="px-4 py-2 align-top">
                                        {column.render(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
                <p>
                    Menampilkan {pagination.from ?? 0} - {pagination.to ?? 0} dari {pagination.total ?? 0} data
                </p>
                <div className="flex flex-wrap gap-2">
                    {pagination.links?.map((link, index) => (
                        <button
                            key={`${link.label}-${index}`}
                            type="button"
                            className={`rounded border px-3 py-1 ${link.active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-700'} ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url, { preserveState: true, preserveScroll: true, replace: true })}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
