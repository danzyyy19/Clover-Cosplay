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

        // Verify user still exists in DB (handle stale sessions)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found. Please login again." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { productId, startDate, endDate, totalDays, totalPrice, rulesAccepted } = body;

        // Validate required fields
        if (!productId || !startDate || !endDate || !totalDays || !totalPrice) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if product exists and is available
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        if (product.stock < 1) {
            return NextResponse.json(
                { error: "Product is not available" },
                { status: 400 }
            );
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                customerId: session.user.id,
                productId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalDays,
                totalPrice,
                rulesAccepted: rulesAccepted || false,
                status: "PENDING",
            },
        });

        // Decrease product stock
        await prisma.product.update({
            where: { id: productId },
            data: { stock: { decrement: 1 } },
        });

        const serializedBooking = {
            ...booking,
            totalPrice: booking.totalPrice.toNumber(),
            // Remove Decimal methods if any other exist, or spread plain object
        };

        return NextResponse.json(serializedBooking, { status: 201 });
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create booking" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        const where: Record<string, unknown> = {};

        // If not admin, only show user's own bookings
        if (session.user.role !== "ADMIN") {
            where.customerId = session.user.id;
        }

        if (status) {
            where.status = status;
        }

        const bookings = await prisma.booking.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                product: {
                    include: {
                        images: {
                            orderBy: { order: "asc" },
                            take: 1,
                        },
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const serializedBookings = bookings.map(booking => ({
            ...booking,
            totalPrice: booking.totalPrice.toNumber(),
            product: {
                ...booking.product,
                pricePerDay: Number(booking.product.pricePerDay),
            }
        }));

        return NextResponse.json(serializedBookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
