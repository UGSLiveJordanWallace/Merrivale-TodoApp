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
        <div className="rounded-lg bg-stone-200 shadow-lg" {...props}>
            <table className="table-auto border-collapse  w-full p-4">
                <thead>
                    <tr>
                        <th>Email</th>
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
                                    className="border-t-2 border-b-2 border-slate-50"
                                    key={key}
                                >
                                    <td>
                                        <h3 className="block text-center">
                                            {val.email}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3 className="block text-center">
                                            {val.list}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3 className="block text-center">
                                            {val.task}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3 className="block text-center">
                                            {val.date}
                                        </h3>
                                    </td>
                                </tr>
                            );
                        })
                        .reverse()}
                </tbody>
            </table>
            <Link href="/control-panel/users/logs">See All</Link>
        </div>
    );
}
