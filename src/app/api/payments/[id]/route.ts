import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { status } = body;

        if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        // Update payment status
        const payment = await prisma.payment.update({
            where: { id },
            data: {
                status,
                verifiedAt: status !== "PENDING" ? new Date() : null,
            },
            include: {
                booking: true,
            },
        });

        // If approved, update booking status to CONFIRMED
        if (status === "APPROVED") {
            await prisma.booking.update({
                where: { id: payment.bookingId },
                data: {
                    status: "CONFIRMED",
                },
            });
        }

        return NextResponse.json(payment);
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json(
            { error: "Failed to update payment" },
            { status: 500 }
        );
    }
}
