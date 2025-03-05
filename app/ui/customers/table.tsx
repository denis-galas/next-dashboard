import Image from 'next/image';
import {
  FormattedCustomersTable
} from '@/app/lib/definitions';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { fetchFilteredCustomers, SortBy, SortOrder } from '@/app/lib/data';
import TableHeader from './table-header';
import { DeleteCustomer } from './buttons';

export default async function CustomersTable({
  currentPage,
  query,
  sortBy,
  sortOrder,
}: {
  currentPage: number;
  query: string;
  sortBy: string;
  sortOrder: string;
}) {

  const customers = await fetchFilteredCustomers(query, sortBy as SortBy, sortOrder as SortOrder, currentPage);

  const formattedCustomers = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    image_url: customer.image_url,
    total_invoices: customer.total_invoices,
    total_pending: customer.total_pending,
    total_paid: customer.total_paid,
  })) as FormattedCustomersTable[];
  const customersNumber = customers.length;

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {formattedCustomers?.map((customer) => (
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
              <TableHeader sortBy={sortBy as SortBy} sortOrder={sortOrder as SortOrder} />

              <tbody className="divide-y divide-gray-200 text-gray-900">
                {formattedCustomers.map((customer) => (
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
                    <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <DeleteCustomer id={customer.id} customersNumber={customersNumber} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
