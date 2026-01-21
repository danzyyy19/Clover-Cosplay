import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { bookingId, amount, proofImageUrl, bankName, accountNumber } = body;

        if (!bookingId || !amount || !proofImageUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify booking belongs to user
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        if (booking.customerId !== session.user.id && session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        // Check if payment already exists
        const existingPayment = await prisma.payment.findUnique({
            where: { bookingId },
        });

        if (existingPayment) {
            // Update existing payment
            const updatedPayment = await prisma.payment.update({
                where: { bookingId },
                data: {
                    proofImageUrl,
                    status: "PENDING", // Reset status to pending on re-upload
                    bankName: bankName || "Unknown",
                    accountNumber: accountNumber || "Unknown",
                }
            });
            return NextResponse.json(updatedPayment);
        }

        // Create new payment
        const payment = await prisma.payment.create({
            data: {
                bookingId,
                customerId: session.user.id, // REQUIRED FIELD
                amount,
                proofImageUrl,
                bankName: bankName || "Unknown",
                accountNumber: accountNumber || "Unknown",
                status: "PENDING",
            },
        });

        return NextResponse.json(payment, { status: 201 });
    } catch (error) {
        console.error("Error creating payment:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create payment" },
            { status: 500 }
        );
    }
}
