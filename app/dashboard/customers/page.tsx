import Table from '@/app/ui/customers/table';
import { fetchCustomersPages } from '@/app/lib/data';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/ui/invoices/pagination';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';

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
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchCustomersPages(query);

    return (
        <div className="w-full">
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Customers
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search customers..." />
                <CreateCustomer />
            </div>

            <Suspense key={`${currentPage}-${sortBy}-${sortOrder}-${query}`} fallback={<CustomersTableSkeleton />}>
                <Table currentPage={currentPage} query={query} sortBy={sortBy} sortOrder={sortOrder} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}