'use client';

import { Button } from '@/app/ui/button';
import { PlusIcon } from "@heroicons/react/24/outline";
import { AddCustomerModal } from "./modals";
import { useState } from "react";
import CreateCustomerModal from "./create-modal";

export function CreateCustomer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div id="modal-container"></div>
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