'use server';

import { fetchCustomerById } from "@/app/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const customer = await fetchCustomerById(id);
    return NextResponse.json(customer);
}
