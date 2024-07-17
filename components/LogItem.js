"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function TableLog({ ...props }) {
    const [records, setRecords] = useState([]);
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel("realtime records")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "logs" },
                (payload) => {
                    const record = {
                        email: payload.new.email,
                        list: payload.new.list,
                        task: payload.new.task,
                        date: Date(
                            Date.parse(payload.new.created_at),
                        ).toString(),
                    };
                    setRecords([...records, record]);
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, records, setRecords]);

    return (
        <div
            className="rounded-lg w-full bg-stone-200 shadow-lg p-2 overflow-auto"
            {...props}
        >
            <table className="table-auto w-full p-4">
                <thead>
                    <tr>
                        <th className="font-bold text-lg">Email</th>
                        <th>List Name</th>
                        <th>Task</th>
                        <th>Date Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {records
                        .map((val, key) => {
                            return (
                                <tr
                                    className="border-t-2 border-b-2 border-slate-50 p-2"
                                    key={key}
                                >
                                    <td className="p-1">
                                        <h3 className="font-bold text-lg text-center">
                                            {val.email}
                                        </h3>
                                    </td>
                                    <td className="p-1">
                                        <h3 className="text-center">
                                            {val.list}
                                        </h3>
                                    </td>
                                    <td className="min-w-52 p-1">
                                        <h3 className="text-center text-pretty">
                                            {val.task}
                                        </h3>
                                    </td>
                                    <td className="min-w-44 p-1">
                                        <h3 className="text-center">
                                            {val.date}
                                        </h3>
                                    </td>
                                </tr>
                            );
                        })
                        .reverse()}
                </tbody>
            </table>
            <Link
                href="/control-panel/users/logs"
                className="inline-block bg-white mt-2 p-1 rounded-lg"
            >
                See All
            </Link>
        </div>
    );
}
