import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Only admin can update booking status
        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        // Validate status
        const validStatuses = ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        // Check if booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!existingBooking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // If cancelling, restore stock
        if (status === "CANCELLED" && existingBooking.status !== "CANCELLED") {
            await prisma.product.update({
                where: { id: existingBooking.productId },
                data: { stock: { increment: 1 } },
            });
        }

        // If completing (costume returned), restore stock
        if (status === "COMPLETED" && existingBooking.status !== "COMPLETED") {
            await prisma.product.update({
                where: { id: existingBooking.productId },
                data: { stock: { increment: 1 } },
            });
        }

        // Update booking status
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status },
            include: {
                product: true,
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const serializedBooking = {
            ...updatedBooking,
            totalPrice: updatedBooking.totalPrice.toNumber(),
            product: {
                ...updatedBooking.product,
                pricePerDay: Number(updatedBooking.product.pricePerDay),
            },
        };

        return NextResponse.json(serializedBooking);
    } catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update booking" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                product: {
                    include: {
                        images: {
                            orderBy: { order: "asc" },
                        },
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                payment: true,
            },
        });

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // Non-admins can only see their own bookings
        if (session.user.role !== "ADMIN" && booking.customerId !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const serializedBooking = {
            ...booking,
            totalPrice: booking.totalPrice.toNumber(),
            product: {
                ...booking.product,
                pricePerDay: Number(booking.product.pricePerDay),
            },
            payment: booking.payment ? {
                ...booking.payment,
                amount: Number(booking.payment.amount),
            } : null,
        };

        return NextResponse.json(serializedBooking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        return NextResponse.json(
            { error: "Failed to fetch booking" },
            { status: 500 }
        );
    }
}
