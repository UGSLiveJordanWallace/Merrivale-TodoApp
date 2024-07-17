"use client";

import { createClient } from "@/utils/supabase/client";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Record = {
    id: number;
    list: string;
    email: string;
    task: string;
    created_at: string;
};

type Token = JwtPayload & {
    user_role?: string;
};

export default function AllLogsPage() {
    const supabase = createClient();
    const [records, setRecords] = useState<Record[]>([]);
    const [startPage, setStartPage] = useState<number>(0);
    const [dataLength, setCount] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        async function validateUser() {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                return router.replace("/login");
            }

            const session = await supabase.auth.getSession();
            const access_token: string | undefined =
                session.data.session?.access_token.toString();
            const token = jwtDecode<Token>(access_token as string);
            const user_role = token.user_role;

            if (user_role !== "admin") {
                return router.replace("/");
            }
        }

        validateUser();

        async function getData() {
            if (startPage < 0 || startPage > dataLength) {
                setStartPage(0);
            }

            const { data, count, error } = await supabase
                .from("logs")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(startPage, startPage + 10);
            if (data && data.length > 0 && count) {
                setCount(count);
                setRecords([...data]);
            } else {
                setStartPage(startPage - 10);
            }
        }
        getData();
    }, [supabase, startPage, setStartPage]);

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full p-10">
            <div className="bg-stone-300 rounded-lg w-full shadow-lg p-4 overflow-auto">
                <table className="table-auto w-full">
                    <thead className="text-2xl">
                        <tr>
                            <th>Email</th>
                            <th>List Name</th>
                            <th>Task</th>
                            <th>Date Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records &&
                            records.map((val, key) => {
                                return (
                                    <tr
                                        className="border-t-2 border-slate-100 text-lg"
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
                                                {new Date(
                                                    Date.parse(val.created_at),
                                                ).toString()}
                                            </h3>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                <div className="flex flex-row text-lg jusitfy-end items-center w-full">
                    <button
                        className="m-2 p-3 bg-white shadow-lg rounded hover:bg-stone-500"
                        onClick={() => setStartPage(0)}
                    >
                        First
                    </button>
                    <button
                        className="m-2 p-3 bg-white shadow-lg rounded hover:bg-stone-500"
                        onClick={() => setStartPage(startPage - 10)}
                    >
                        Back
                    </button>
                    <button
                        className="m-2 p-3 bg-white shadow-lg rounded hover:bg-stone-500"
                        onClick={() => setStartPage(startPage + 10)}
                    >
                        Next
                    </button>
                    <button
                        className="m-2 p-3 bg-white shadow-lg rounded hover:bg-stone-500"
                        onClick={() =>
                            setStartPage(
                                dataLength % 10 === 0
                                    ? dataLength - 10
                                    : Math.floor((dataLength as number) / 10) *
                                          10,
                            )
                        }
                    >
                        Last
                    </button>
                </div>
            </div>
            <Link
                href="/control-panel/users"
                className="p-5 bg-stone-700 text-white text-2xl text-center shadow-lg rounded w-1/2 mt-5"
            >
                Go Back
            </Link>
        </div>
    );
}
