'use client'
import { UserIcon, EnvelopeIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "../button";
import { useActionState, useRef } from "react";
import { CustomerState, createCustomer } from "@/app/lib/actions";

export default function CreateCustomerModal({ onClose }: { onClose: () => void }) {
  const initialState: CustomerState = {
    errors: {},
    values: {},
    message: null,
  };

  const imageInput = useRef<HTMLInputElement>(null);

  function handleImageUploadValidation() {
    const file_size = imageInput.current?.files?.[0].size ? imageInput.current?.files?.[0].size : 0;
    if (file_size >= 4 * 1024 * 1024) {
      document.getElementById('image-filesize-error-message')?.classList.remove('hidden');
      document.getElementById('create-customer-button')?.setAttribute('disabled', 'disabled');
      document.getElementById('create-customer-button')?.setAttribute('aria-disabled', 'true');
    } else {
      document.getElementById('image-filesize-error-message')?.classList.add('hidden');
      document.getElementById('create-customer-button')?.removeAttribute('disabled');
      document.getElementById('create-customer-button')?.setAttribute('aria-disabled', 'false');
    }
  }

  const [state, formAction, isPending] = useActionState(createCustomer, initialState);

  return (
    <form action={formAction}
      aria-describedby={state.message ? 'message' : undefined}
      className="min-w-[300px] max-h-[90vh] overflow-y-auto md:min-w-[600px] md:max-h-[70vh]"
    >
      <div className="rounded-md p-4 md:p-6">
        <h1 className="mb-6 text-lg font-medium">Create Customer</h1>
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
                required
                defaultValue={typeof state?.values?.name === 'string' ? state?.values?.name : ''}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
                required
                defaultValue={typeof state?.values?.email === 'string' ? state?.values?.email : ''}
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Photo 
            <span className="text-gray-500">(Optional, 4mb max)</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                placeholder="Enter image URL"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="image-error"
                onChange={handleImageUploadValidation}
                ref={imageInput}
              />
              <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="image-error" aria-live="polite" aria-atomic="true">
              <p className="mt-2 text-sm text-red-500 hidden" id="image-filesize-error-message">File size must be less than 4mb</p>
              {state.errors?.image &&
                state.errors.image.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                ))}
            </div>
          </div>

          <p id="message" className="mt-2 text-sm text-red-500" aria-live="polite" aria-atomic="true">
            {state.message}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button type="button"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            onClick={onClose}>Close</button>
          <Button type="submit" id="create-customer-button" aria-disabled={isPending}>Create Customer</Button>
        </div>
      </div>


    </form>
  )
}
