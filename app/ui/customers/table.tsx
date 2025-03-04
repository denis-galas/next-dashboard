'use client';

import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  FormattedCustomersTable
} from '@/app/lib/definitions';
import { CreateCustomer } from './buttons';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { SortBy, SortOrder } from '@/app/lib/data';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { useTransition } from 'react';

export default function CustomersTable({
  customers,
}: {
  customers: FormattedCustomersTable[];
}) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const sortColumn = searchParams.get('sortBy') ? searchParams.get('sortBy') as SortBy : 'name';
  const sortOrder = searchParams.get('sortOrder') ? searchParams.get('sortOrder') as SortOrder : 'asc';

  const handleSort = (column: SortBy) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (column === sortColumn) {
        params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        params.set('sortBy', column);
        params.set('sortOrder', 'asc');
      }
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>

      {isPending ? (
        <CustomersTableSkeleton />
      ) : (
        <div className="mt-6 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                <div className="md:hidden">
                  {customers?.map((customer) => (
                    <div
                      key={customer.id}
                      className="mb-2 w-full rounded-md bg-white p-4"
                    >
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <div className="mb-2 flex items-center">
                            <div className="flex items-center gap-3">
                              {customer.image_url ? (
                                <Image
                                  src={customer.image_url}
                                  className="rounded-full"
                                  alt={`${customer.name}'s profile picture`}
                                  width={28}
                                  height={28}
                                />
                              ) : (
                                <UserCircleIcon className="h-12 w-12 text-gray-900" />
                              )}
                              <p>{customer.name}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between border-b py-5">
                        <div className="flex w-1/2 flex-col">
                          <p className="text-xs">Pending</p>
                          <p className="font-medium">{customer.total_pending}</p>
                        </div>
                        <div className="flex w-1/2 flex-col">
                          <p className="text-xs">Paid</p>
                          <p className="font-medium">{customer.total_paid}</p>
                        </div>
                      </div>
                      <div className="pt-4 text-sm">
                        <p>{customer.total_invoices} invoices</p>
                      </div>
                    </div>
                  ))}
                </div>
                <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                  <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                    <tr>
                      <th scope="col" className="px-4 py-5 font-medium sm:pl-6 cursor-pointer" onClick={() => handleSort('name')}>
                        Name
                        {sortColumn === 'name' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}

                      </th>
                      <th scope="col" className="px-3 py-5 font-medium cursor-pointer" onClick={() => handleSort('email')}>
                        Email
                        {sortColumn === 'email' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium cursor-pointer" onClick={() => handleSort('total_invoices')}>
                        Total Invoices
                        {sortColumn === 'total_invoices' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium cursor-pointer" onClick={() => handleSort('total_pending')}>
                        Total Pending
                        {sortColumn === 'total_pending' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th scope="col" className="px-4 py-5 font-medium cursor-pointer" onClick={() => handleSort('total_paid')}>
                        Total Paid
                        {sortColumn === 'total_paid' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-gray-900">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="group">
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                          <div className="flex items-center gap-3">
                            {customer.image_url ? (
                              <Image
                                src={customer.image_url}
                                className="rounded-full"
                                alt={`${customer.name}'s profile picture`}
                                width={28}
                                height={28}
                              />
                            ) : (
                              <UserCircleIcon className="h-12 w-12 text-gray-900" />
                            )}
                            <p>{customer.name}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {customer.email}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {customer.total_invoices}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {customer.total_pending}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                          {customer.total_paid}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
