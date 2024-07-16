import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DropDown from "@/components/DropDown";
import CreateButton from "@/components/CreateButton";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import Link from "next/link";

type Token = JwtPayload & {
    user_role?: string;
};

export default async function ControlPanelPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: lists, error } = await supabase.from("tablenames").select();

    const session = await supabase.auth.getSession();
    const access_token: string | undefined =
        session.data.session?.access_token.toString();
    const token = jwtDecode<Token>(access_token as string);
    const user_role = token.user_role;

    if (user_role !== "admin") {
        return redirect("/");
    }

    return (
        <div className="w-full h-screen flex flex-col gap-20 overflow-auto items-center">
            <div className="w-full">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                        <AuthButton />
                        <Link
                            href="/control-panel/users"
                            className="p-3 bg-stone-200 rounded-lg"
                        >
                            Management
                        </Link>
                    </div>
                </nav>
            </div>

            <div className="flex flex-col gap-5 w-3/5">
                {lists &&
                    lists.length > 0 &&
                    lists.map((list, key) => (
                        <DropDown key={key} name={list.table_name} />
                    ))}
                <div className="block relative bg-stone-300 border rounded-lg shadow">
                    <CreateButton>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-7 h-7 m-auto"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </CreateButton>
                </div>
            </div>
        </div>
    );
}
