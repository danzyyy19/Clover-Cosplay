import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { nameEn: "asc" },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nameEn, nameTh } = body;

        if (!nameEn) {
            return NextResponse.json(
                { error: "Name (English) is required" },
                { status: 400 }
            );
        }

        const slug = nameEn
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const category = await prisma.category.create({
            data: { nameEn, nameTh, slug },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
