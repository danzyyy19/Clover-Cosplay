import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Convert Decimal to number for JSON serialization
        return NextResponse.json({
            ...product,
            pricePerDay: Number(product.pricePerDay),
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const json = await request.json();

        // Extract related data that needs special handling
        const { images, sizes, ...productData } = json;

        // Transaction to update product and related data
        const updatedProduct = await prisma.$transaction(async (tx) => {
            // 1. Update basic product info
            const product = await tx.product.update({
                where: { id },
                data: {
                    ...productData,
                    size: sizes && sizes.length > 0 ? sizes[0] : undefined, // Map array to single string field
                },
            });

            // 2. Handle Images if provided
            if (images && Array.isArray(images)) {
                // Remove existing images
                await tx.productImage.deleteMany({
                    where: { productId: id },
                });

                // Create new images
                if (images.length > 0) {
                    await tx.productImage.createMany({
                        data: images.map((url: string, index: number) => ({
                            productId: id,
                            url,
                            order: index,
                        })),
                    });
                }
            }

            return product;
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
