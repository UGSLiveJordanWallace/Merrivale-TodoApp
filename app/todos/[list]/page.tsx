import TodoItem from "@/components/TableItem";
import { getListData } from "../../../utils/db";
import Link from "next/link";
import ClearButton from "@/components/ClearButton";

export default async function TodosPage({
    params,
}: {
    params: { list: string };
}) {
    const { data, error } = await getListData(decodeURI(params.list));

    if (error) {
        console.log(error);
        return <pre>Error</pre>;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-7xl text-black ">{decodeURI(params.list)}</h1>
            <table className="block rounded shadow-lg overflow-y-auto mt-5 m-3">
                <tbody>
                    {data &&
                        data.length > 0 &&
                        data.map((val) => (
                            <TodoItem
                                key={val.id}
                                id={val.id}
                                list={params.list}
                                task={val.task}
                                completed={val.is_complete}
                            />
                        ))}
                </tbody>
            </table>
            <div className="flex flex-row mt-5 items-center justify-between w-full text-xl">
                <Link
                    className="p-5 bg-orange-200 rounded-sm hover:bg-orange-400 transition duration-300"
                    href="/"
                >
                    Go Back
                </Link>
                <ClearButton name={decodeURI(params.list)}>Clear</ClearButton>
            </div>
        </div>
    );
}
