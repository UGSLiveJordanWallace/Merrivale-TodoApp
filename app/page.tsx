import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/AuthButton";

export default async function Index() {
    const supabase = createClient();
    const { data, error } = await supabase.from("tablenames").select();

    if (error) {
        console.log(error);
        return <pre>Hello World</pre>;
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex-initial flex flex-row justify-center items-center p-5">
                <AuthButton />
            </div>
            <div className="flex-auto flex flex-col h-full w-full items-center gap-4 overflow-auto">
                {data &&
                    data.length > 0 &&
                    data.map((table) => (
                        <TodoButton
                            key={table.id}
                            link={`/todos/${table.table_name}`}
                            name={`${table.table_name}`}
                        />
                    ))}
            </div>
        </div>
    );
}

function TodoButton({ link, name }: { link: string; name: string }) {
    return (
        <Link
            className="block bg-stone-300 w-3/4 text-xl mobile:text-5xl mobile:w-1/2 text-center p-16 text-black text-5xl rounded-lg hover:bg-teal-500 hover:shadow-xl hover:rounded-none transition-all duration-300 ease-in-out"
            href={link}
        >
            {name}
        </Link>
    );
}
