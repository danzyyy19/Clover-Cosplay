import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string, locale: string = "th"): string {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
        style: "currency",
        currency: "THB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);
}

export function formatDate(date: Date | string, locale: string = "th"): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(d);
}

export function formatDateShort(date: Date | string, locale: string = "th"): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(d);
}

export function calculateDays(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end date
}

export function calculateLateFee(
    daysLate: number,
    pricePerDay: number
): { fee: number; percentage: number } {
    if (daysLate <= 0) return { fee: 0, percentage: 0 };
    if (daysLate <= 3) return { fee: pricePerDay * daysLate * 0.5, percentage: 50 };
    if (daysLate <= 7) return { fee: pricePerDay * daysLate, percentage: 100 };
    return { fee: pricePerDay * 100, percentage: -1 }; // Full costume price
}

export function calculateRefund(
    daysUntilRental: number,
    totalPrice: number
): { refund: number; percentage: number } {
    if (daysUntilRental > 7) return { refund: totalPrice, percentage: 100 };
    if (daysUntilRental >= 3) return { refund: totalPrice * 0.5, percentage: 50 };
    return { refund: 0, percentage: 0 };
}

export function generateBookingId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CLV-${timestamp}-${random}`;
}
