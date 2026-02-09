import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AdminOrderList } from "./admin-order-list";

export default async function AdminOrdersPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect(`/${locale}/login`);
    }

    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            customer: { select: { name: true, email: true } },
            product: { select: { nameEn: true } },
        },
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "ACTIVE": return { bg: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4" };
            case "PENDING": return { bg: "rgba(240, 230, 140, 0.2)", color: "#F0E68C" };
            case "COMPLETED": return { bg: "rgba(147, 112, 219, 0.2)", color: "#9370DB" };
            case "CANCELLED": return { bg: "rgba(255, 182, 193, 0.2)", color: "#FFB6C1" };
            default: return { bg: "rgba(156, 163, 175, 0.2)", color: "#9CA3AF" };
        }
    };

    // Convert Decimal to number for client component
    // Convert Decimal to number for client component
    const serializedBookings = bookings.map((booking: any) => ({
        ...booking,
        totalPrice: Number(booking.totalPrice),
        // Ensure dates are just dates
    }));

    return (
        <AdminLayout pageTitle={locale === "th" ? "คำสั่งซื้อ" : "Orders"}>
            <div style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "20px"
            }}>
                <AdminOrderList orders={serializedBookings} locale={locale} />
            </div>
        </AdminLayout>
    );
}
