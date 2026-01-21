"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/products";

interface DeleteProductButtonProps {
    id: string;
}

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = confirm("Are you sure you want to delete this product? This action cannot be undone.");
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            const result = await deleteProduct(id);
            if (result.success) {
                // Determine if we need to refresh manually or if revalidatePath handles it.
                // revalidatePath handles the data, but router.refresh() updates the client cache view.
                router.refresh();
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("An error occurred while deleting the product");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
                padding: "6px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-secondary)",
                border: "none",
                cursor: isDeleting ? "not-allowed" : "pointer",
                display: "flex",
                opacity: isDeleting ? 0.5 : 1
            }}
            title="Delete Product"
        >
            {isDeleting ? (
                <Loader2 size={14} className="animate-spin" color="#FFB6C1" />
            ) : (
                <Trash2 size={14} color="#FFB6C1" />
            )}
        </button>
    );
}
