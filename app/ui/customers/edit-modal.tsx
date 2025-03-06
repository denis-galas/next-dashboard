import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Button } from "../button";
import { useActionState, useState, useEffect } from "react";
import { CustomerState, updateCustomer } from "@/app/lib/actions";
import { CustomerField, FormattedCustomersTable } from "@/app/lib/definitions";

export default function EditCustomerModal({ customer, onClose }: { customer: FormattedCustomersTable, onClose: () => void }) {

    const [customerData, setCustomerData] = useState<CustomerField | null>(null);

    useEffect(() => {
        fetch(`/api/customers/${customer.id}`)
          .then(res => res.json())
          .then((data: CustomerField) => {
            setCustomerData(data);
          });
      }, [customer.id]);

    const initialState: CustomerState = {
        errors: {},
        values: {
            name: customerData?.name,
            email: customerData?.email,
            //image: customer.image_url,
        },
        message: null,
    };

    const updateCustomerWithId = updateCustomer.bind(null, customer.id);
    const [state, formAction, isPending] = useActionState(updateCustomerWithId, initialState);

    return (
        <form action={formAction}
            aria-describedby={state?.message ? 'message' : undefined}
            className="min-w-[300px] max-h-[90vh] overflow-y-auto md:min-w-[600px] md:max-h-[70vh]"
        >
            {!customerData ? (<div className="flex justify-center items-center h-full">Loading...</div>) : (
                <div className="rounded-md p-4 md:p-6">
                    <h1 className="mb-6 text-lg font-medium">Edit Customer</h1>
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
                                defaultValue={typeof state?.values?.name === 'string' ? state?.values?.name : customerData?.name}
                            />
                            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.name &&
                                state?.errors.name.map((error: string) => (
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
                                defaultValue={typeof state?.values?.email === 'string' ? state?.values?.email : customerData?.email}
                            />
                            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <div id="email-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.email &&
                                state?.errors.email.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    {/* <label htmlFor="image" className="mb-2 block text-sm font-medium">
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
                            <p className={`mt-2 text-sm text-red-500 ${isInvalidImage ? '' : 'hidden'}`} id="image-filesize-error-message">File size must be less than 4mb</p>
                            {state?.errors?.image &&
                                state?.errors.image.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                        </div>
                    </div> */}

                    <p id="message" className="mt-2 text-sm text-red-500" aria-live="polite" aria-atomic="true">
                        {state?.message}
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button type="button"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                        onClick={onClose}>Close</button>
                    <Button type="submit" id="edit-customer-button" disabled={isPending} aria-disabled={isPending}>Edit Customer</Button>
                </div>
            </div>
            )}


        </form>
    )
}
