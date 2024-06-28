"use client";
import { clearCompleted } from "@/utils/db";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
    name: string;
};

export default function ClearButton({ children, name }: Props) {
    const router = useRouter();

    async function handleClear(e: any) {
        e.preventDefault();
        const response = await clearCompleted(name);
        if (response.success) {
            router.refresh();
            return;
        }
        console.log(response.error);
    }

    return (
        <button
            onClick={handleClear}
            className="p-5 bg-red-300 rounded-sm hover:bg-red-600 transition duration-300"
        >
            {children}
        </button>
    );
}
