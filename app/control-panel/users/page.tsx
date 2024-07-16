import AuthButton from "@/components/AuthButton";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import TableLog from "@/components/LogItem";

type Token = JwtPayload & {
    user_role?: string;
};

export default async function UserManagementPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const session = await supabase.auth.getSession();
    const access_token: string | undefined =
        session.data.session?.access_token.toString();
    const token = jwtDecode<Token>(access_token as string);
    const user_role = token.user_role;

    if (user_role !== "admin") {
        return redirect("/");
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <nav className="flex-initial flex flex-row justify-center items-center gap-4">
                <AuthButton />
                <Link
                    href="/control-panel"
                    className="p-3 bg-stone-200 rounded-lg"
                >
                    Control Panel
                </Link>
            </nav>
            <div className="flex-auto h-full">
                <div className="flex flex-col justify-center h-full p-5">
                    <TableLog />
                </div>
            </div>
        </div>
    );
}
