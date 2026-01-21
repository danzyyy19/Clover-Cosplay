"use client";

import { Printer } from "lucide-react";

interface PrintReceiptButtonProps {
    label: string;
}

export function PrintReceiptButton({ label }: PrintReceiptButtonProps) {
    return (
        <button
            onClick={() => window.print()}
            className="print-btn"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "white",
                border: "1px solid #ddd",
                color: "#333",
                fontSize: "12px",
                cursor: "pointer",
            }}
        >
            <Printer size={14} />
            {label}
        </button>
    );
}
