"use client";
import { useEffect, useState } from "react";
import { deleteItem, deleteItems, getListData, updateItems } from "@/utils/db";
import { type ComponentProps } from "react";
import { RowList } from "postgres";
import { useRouter } from "next/navigation";

type Props = ComponentProps<"div"> & {
    name?: string;
};

export default function DropDown({ name }: Props) {
    const [listData, setListData] = useState<RowList<any>>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState<string>();

    const router = useRouter();

    async function getData() {
        const { data, error } = await getListData(name);
		if (error) {
			return setError(error.message)
		}
        if (data) {
            setListData(data);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    async function handleDropDownAction(e: any) {
        e.preventDefault();
        setError(undefined);
        setSuccess(undefined);
        if (!isOpen) {
            setIsOpen(true);
            return;
        }
        return setIsOpen(false);
    }

    function handleAdd(e: any) {
        e.preventDefault();
        setError(undefined);
        setSuccess(undefined);
        let newData: RowList<any> = {
            task: "New Task",
            name: name,
            is_complete: false,
        };
        setListData([...listData, newData]);
    }

    async function handleDelete(e: any, key: number) {
        e.preventDefault();
        setError(undefined);
        setSuccess(undefined);
        if (listData[key].id) {
            const response = await deleteItem(JSON.parse(listData[key].id));
            if (response.success) {
                setSuccess(response.success);
                getData();
                return;
            }
            return setError(response.error);
        }
        listData.splice(key, 1);
        setListData([...listData]);
    }

    async function handleDeleteAll(e: any, name: string) {
        e.preventDefault();
        const response = await deleteItems(name);
        if (response.error) {
            return setError(response.error);
        }
        router.refresh();
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        setError(undefined);
        setSuccess(undefined);
        const response = await updateItems(listData);
        if (response.success) {
            getData();
            return setSuccess(response.success);
        }
        return setError(response.error);
    }

    function handleChange(e: any, key: number) {
        e.preventDefault();
        listData[key]["task"] = e.target.value;
        setListData([...listData]);
    }

    return (
        <div className="relative block w-full bg-stone-100 text-xl mobile:text-3xl desktop:text-5xl wide:text-7xl text-center rounded-lg">
            <div className="flex flex-row items-center justify-center">
                <button
                    onClick={handleDropDownAction}
                    className="w-full p-5 bg-none"
                >
                    {name}
                </button>
                <button
                    onClick={(e) => handleDeleteAll(e, name)}
                    className="right-0 mr-2 size-8 mobile:size-16 desktop:size-24 wide:size-32"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                </button>
            </div>
            {error && !success && <p>{error}</p>}
            {success && !error && <p>{success}</p>}
            {isOpen && (
                <div className="relative p-2">
                    {listData &&
                        listData.length > 0 &&
                        listData.map((list: any, key: number) => (
                            <div
                                key={key}
                                className="flex flex-row mt-1 w-full text-2xl"
                            >
                                <input
                                    className="w-full"
                                    onChange={(e) => handleChange(e, key)}
                                    value={list.task}
                                />
                                <button
                                    onClick={(e) => handleDelete(e, key)}
                                    className="right-0 bg-red-500 size-8"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    <button
                        onClick={handleAdd}
                        className="bg-lime-400 p-2 mt-3 mr-1 rounded-lg"
                    >
                        Add
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-white rounded-lg p-2 mt-3 mr-1"
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}
