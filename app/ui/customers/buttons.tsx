'use client';

import { Button } from '@/app/ui/button';
import { PlusIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { AddCustomerModal } from "./modals";
import { useState } from "react";
import CreateCustomerModal from "./create-modal";
import { deleteCustomer } from '@/app/lib/actions';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function CreateCustomer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
      >
        <span className="hidden md:block">Create Customer</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </Button>
      <AddCustomerModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="modal rounded-md border-blue-500">
          <CreateCustomerModal onClose={() => setIsOpen(false)} />
        </div>
      </AddCustomerModal>
    </>
  );
}

export function DeleteCustomer({ id, customersNumber }: { id: string, customersNumber: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (isPending) return;//prevent multiple clicks

    setIsPending(true);
    await deleteCustomer(id);

    const params = new URLSearchParams(searchParams);

    if (customersNumber === 1) {
      params.set('page', '1');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form>
      {isPending ? (
        <div className="p-2">
          <ArrowPathIcon className="w-5 animate-spin" />
        </div>
      ) : (
        <button type="button" onClick={handleDelete} className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      )}
    </form>
  );
}