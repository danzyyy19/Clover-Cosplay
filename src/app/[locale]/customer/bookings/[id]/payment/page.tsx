import { setRequestLocale } from "next-intl/server";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { PaymentUploadForm } from "@/components/bookings/payment-upload-form";
import { auth } from "@/lib/auth";

// Hardcoded bank account for now, but could be in DB/Settings
const bankAccount = {
    bankName: "Bangkok Bank",
    accountNumber: "1234567890",
    accountName: "Clover Cosplay Co., Ltd.",
};

export default async function PaymentUploadPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    // Double check user existence
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        redirect(`/${locale}/login`);
    }

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            product: true,
            payment: true,
        },
    });

    if (!booking) {
        notFound();
    }

    // Convert decimal to number for client component
    const bookingForClient = {
        ...booking,
        totalPrice: Number(booking.totalPrice),
        product: {
            ...booking.product,
            pricePerDay: Number(booking.product.pricePerDay),
        },
    };

    const paymentForClient = booking.payment ? {
        ...booking.payment,
        amount: Number(booking.payment.amount),
    } : undefined;

    return (
        <CustomerLayout pageTitle={locale === "th" ? "แจ้งชำระเงิน" : "Upload Payment Proof"}>
            <PaymentUploadForm
                booking={bookingForClient}
                bankAccount={bankAccount}
                initialPayment={paymentForClient}
            />
        </CustomerLayout>
    );
}
