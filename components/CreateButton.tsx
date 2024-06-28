"use client";

import { createList } from "@/utils/db";
import { type ComponentProps } from "react";
import { useRouter } from "next/navigation";

type Props = ComponentProps<"button">;

export default function Button({ children }: Props) {
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const name = formData.get("name");
        const response = await createList(name);
        console.log(response);
        router.refresh();
    }

    return (
        <form className="flex flex-col items-center justify-center w-full h-full p-2">
            <input
                className="w-full text-2xl p-1.5"
                name="name"
                id="name"
                type="text"
            />
            <button
                className="w-full p-5 bg-green-500 mt-3"
                formAction={handleSubmit}
                type="submit"
            >
                {children}
            </button>
        </form>
    );
}
