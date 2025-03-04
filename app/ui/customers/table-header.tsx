'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// import { useTransition } from 'react';
import { SortBy, SortOrder } from '@/app/lib/data';

export default function TableHeader({ sortBy, sortOrder }: { sortBy: SortBy, sortOrder: SortOrder }) {
    //const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSort = (column: SortBy) => {
        //startTransition(() => {
            const params = new URLSearchParams(searchParams);
            if (column === sortBy) {
                params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
                params.set('sortBy', column);
                params.set('sortOrder', 'asc');
            }
            replace(`${pathname}?${params.toString()}`);
        //});
    };


    return (
        <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
            <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 cursor-pointer" onClick={() => handleSort('name')}>
                    Name
                    {sortBy === 'name' && (
                        <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                    )}

                </th>
                <th scope="col" className="px-3 py-5 font-medium cursor-pointer" onClick={() => handleSort('email')}>
                    Email
                    {sortBy === 'email' && (
                        <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                    )}
                </th>
                <th scope="col" className="px-3 py-5 font-medium cursor-pointer" onClick={() => handleSort('total_invoices')}>
                    Total Invoices
                    {sortBy === 'total_invoices' && (
                        <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                    )}
                </th>
                <th scope="col" className="px-3 py-5 font-medium cursor-pointer" onClick={() => handleSort('total_pending')}>
                    Total Pending
                    {sortBy === 'total_pending' && (
                        <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                    )}
                </th>
                <th scope="col" className="px-4 py-5 font-medium cursor-pointer" onClick={() => handleSort('total_paid')}>
                    Total Paid
                    {sortBy === 'total_paid' && (
                        <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                    )}
                </th>
            </tr>
        </thead>
    );
}
