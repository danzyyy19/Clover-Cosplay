import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/layout/admin-layout";
import Link from "next/link";
import { AdminOrderDetail } from "./admin-order-detail";

export default async function AdminOrderDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect(`/${locale}/login`);
    }

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            customer: true,
            product: {
                include: {
                    images: true,
                },
            },
            payment: true,
        },
    });

    if (!booking) {
        redirect(`/${locale}/admin/orders`);
    }

    // Serialize Decimal fields to numbers
    const serializedBooking = {
        ...booking,
        totalPrice: Number(booking.totalPrice),
        product: {
            ...booking.product,
            pricePerDay: Number(booking.product.pricePerDay),
        },
        payment: booking.payment ? {
            ...booking.payment,
            amount: Number(booking.payment.amount),
        } : null,
    };

    return (
        <AdminLayout pageTitle={`Order #${booking.id.slice(-6).toUpperCase()}`}>
            <AdminOrderDetail booking={serializedBooking} locale={locale} />
        </AdminLayout>
    );
}
