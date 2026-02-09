"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function deleteProduct(id: string) {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("ไม่มีสิทธิ์เข้าถึง");
    }

    try {
        await prisma.product.delete({
            where: { id },
        });

        revalidatePath("/[locale]/admin/products");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { success: false, error: "เกิดข้อผิดพลาดในการลบสินค้า" };
    }
}
