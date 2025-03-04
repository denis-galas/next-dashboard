import Table from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { SortBy, SortOrder } from '@/app/lib/data';

export const metadata: Metadata = {
    title: 'Customers',
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}) {
    const searchParams = await props.searchParams;

    const query = searchParams?.query || '';
    const sortBy = searchParams?.sortBy || 'name';
    const sortOrder = searchParams?.sortOrder || 'asc';
    const customers = await fetchFilteredCustomers(query, sortBy as SortBy, sortOrder as SortOrder);

    const formattedCustomers = customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices: customer.total_invoices,
        total_pending: customer.total_pending,
        total_paid: customer.total_paid,
    }));
    return (
        <div className="w-full">
            <Suspense fallback={<CustomersTableSkeleton />}>
                <Table customers={formattedCustomers} />
            </Suspense>
        </div>
    );
}