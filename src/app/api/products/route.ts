import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            include: { category: true },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            nameEn,
            nameTh,
            descriptionEn,
            descriptionTh,
            anime,
            character,
            pricePerDay,
            stock,
            categoryId,
            images,
            sizes,
            includes,
        } = body;

        if (!nameEn || !anime || !character || !pricePerDay || !categoryId) {
            return NextResponse.json(
                { error: "Required fields: nameEn, anime, character, pricePerDay, categoryId" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                nameEn,
                nameTh: nameTh || nameEn, // Fallback to nameEn if missing
                descriptionEn: descriptionEn || "",
                descriptionTh: descriptionTh || "",
                anime,
                character,
                pricePerDay,
                size: body.size || (sizes && sizes.length > 0 ? sizes[0] : "Free Size"),
                stock: stock || 1,
                includes: includes || "",
                categoryId: categoryId, // Must be provided
                images: {
                    create: (images || []).map((url: string) => ({ url })),
                },
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}

