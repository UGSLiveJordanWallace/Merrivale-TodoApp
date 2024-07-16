import Link from "next/link";
import { SubmitButton } from "./submit-button";
import { signIn, signUp } from "../auth/actions";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    return (
        <div className="flex flex-row items-center justify-center h-screen">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>{" "}
                Back
            </Link>
            <div className="flex-1 flex flex-col relative h-1/2 w-full items-center justify-center sm:max-w-md gap-2">
                <form className="flex-1 flex flex-col justify-center shadow-lg p-10 rounded-lg gap-2">
                    {searchParams.message &&
                        searchParams.message.startsWith("Error") && (
                            <p className="block p-5 text-lg font-bold bg-red-400 rounded-lg">
                                {searchParams.message}
                            </p>
                        )}
                    {searchParams.message &&
                        searchParams.message.startsWith("Success") && (
                            <p className="block p-5 text-lg font-bold bg-green-400 rounded-lg">
                                {searchParams.message} Check Email For
                                Verification
                            </p>
                        )}
                    <label className="text-md" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                    <label className="text-md" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />
                    <SubmitButton
                        formAction={signIn}
                        className="bg-green-700 rounded-md px-4 py-2 text-foreground"
                        pendingText="Signing In..."
                    >
                        Sign In
                    </SubmitButton>
                    <SubmitButton
                        formAction={signUp}
                        className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
                        pendingText="Signing Up..."
                    >
                        Sign Up
                    </SubmitButton>
                </form>
            </div>
        </div>
    );
}
