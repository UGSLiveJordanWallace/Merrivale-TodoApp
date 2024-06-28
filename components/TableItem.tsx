"use client";

import clsx from "clsx";
import { type ComponentProps } from "react";
import { update } from "../utils/db";
import { useRouter } from "next/navigation";

type Props = ComponentProps<"tr"> & {
    id?: number;
    task: string;
    completed: string;
};

export default function TodoItem({ id, task, completed }: Props) {
    const router = useRouter();

    const handleClick = async (e: any) => {
        e.preventDefault();
        const is_completed = !JSON.parse(completed);
        const resp = await update(id, is_completed);
        router.refresh();
    };

    return (
        <tr
            className={clsx(
                "h-24",
                JSON.parse(completed) &&
                    "bg-orange-400 hover:bg-orange-600 transition duration-500",
                !JSON.parse(completed) &&
                    "bg-slate-100 hover:bg-orange-300 transition duration-500",
            )}
            key={id}
            onClick={handleClick}
        >
            <td className="p-8">
                <div className="relative">
                    <input
                        className="peer text-white bg-white border border-orange-300 antialiased appearance-none w-8 h-8 rounded bg-inherit shrink-0 focus:outline-none checked:bg-transparent-400"
                        value=""
                        type="checkbox"
                        checked={JSON.parse(completed)}
                        readOnly
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute top-0 w-8 h-8 hidden peer-checked:block"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                </div>
            </td>
            <td className="p-8">{task}</td>
        </tr>
    );
}
