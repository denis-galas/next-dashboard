'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, {
    message: 'Please enter an amount greater than $0.',
  }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error(error);

    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    const customerId = formData.get('customerId');
    let customerName = 'Customer';
    if (!customerId) {
      const customer = await sql`SELECT * FROM customers WHERE id = ${customerId}`;
      customerName = customer ? customer[0].name : customerName;
    }

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: `Missing Fields. Failed to Update Invoice for ${customerName}.`,
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`UPDATE invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export type SignupState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  values?: {
    name?: string;
    email?: string;
    password?: string;
  };
  message?: string | null;
};
const SignupSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter a name.',
  }),
  email: z.string({
    invalid_type_error: 'Please enter an email address.',
  }).email({
    message: 'Please enter a valid email address.',
  }).refine(async (email) => {
    const existingUser = await sql`SELECT email FROM users WHERE email = ${email}`;
    return existingUser.length === 0;
  }, {
    message: 'User with this email already exists in database'
  }),
  password: z.string({
    invalid_type_error: 'Please enter a password.',
  }).min(6, {
    message: 'Password must be at least 6 characters long.',
  })
});
const SignupFormSchema = SignupSchema.omit({ id: true });

export async function signup(prevState: SignupState | undefined, formData: FormData) {
  const validatedFields = await SignupFormSchema.safeParseAsync({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    prevState = {
      errors: validatedFields.error.flatten().fieldErrors,
      values: Object.fromEntries(formData.entries()),
      message: 'Missing Fields. Failed to Signup.',
    };

    return prevState;
  }

  const { name, email, password } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

  } catch (error) {
    console.error(error);

    prevState = {
      message: 'Database Error: Failed to Signup.',
    };

    return prevState;
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          prevState = {
            message: 'Invalid credentials.',
          };

          return prevState;
        default:
          prevState = {
            message: 'Something went wrong.',
          };

          return prevState;
      }
    }
    throw error;
  }
}

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image?: string[];
  };
  values?: {
    name?: string;
    email?: string;
  };
  message?: string | null;
};

const CreateCustomerFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter a name.',
  }).refine(async (name) => {
    const existingCustomer = await sql`SELECT name FROM customers WHERE name = ${name}`;
    return existingCustomer.length === 0;
  }, {
    message: 'Customer with this name already exists in database'
  }),
  email: z.string({
    invalid_type_error: 'Please enter an email address.',
  }).email({
    message: 'Please enter a valid email address.',
  }),
  image: z.instanceof(File)
    .refine((file) => {
      if (!file.size) return true; // Allow empty
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
    }, 'File must be an image (JPEG, PNG or WebP)')
    .refine((file) => {
      if (!file) return true; // Allow empty
      return file.size <= 20 * 1024 * 1024; // 20MB limit
    }, 'File size must be less than 20MB')
    .optional(),
});

const CreateCustomerSchema = CreateCustomerFormSchema.omit({ id: true });

export async function createCustomer(prevState: CustomerState | undefined, formData: FormData) {
  const validatedFields = await CreateCustomerSchema.safeParseAsync({
    name: formData.get('name'),
    email: formData.get('email'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    prevState = {
      errors: validatedFields.error.flatten().fieldErrors,
      values: Object.fromEntries(formData.entries()),
      message: 'Failed to Create Customer.',
    };

    return prevState;
  }

  const { name, email, image } = validatedFields.data;

  try {
    let image_url = '';
    if (image && image instanceof File && image.size > 0) {
      image_url = `/customers/${image.name}`;
      const imagePath = path.join(process.cwd(), 'public', image_url);
      const buffer = Buffer.from(await image.arrayBuffer());
      fs.writeFileSync(imagePath, buffer);
    }

    await sql`
      INSERT INTO customers (name, email, image_url)
        VALUES (${name}, ${email}, ${image_url})
    `;
  } catch (error) {
    console.error(error);

    prevState = {
      message: 'Submit Error: Failed to Create Customer.',
    };

    return prevState;
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}