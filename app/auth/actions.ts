"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect("/login?message=Error (Could not authenticate user)");
    }

    return redirect("/control-panel");
}

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        console.log(error);
        return redirect("/login?message=Error (Could not create user)");
    }

    return redirect("/login?message=Success (Created User)");
}
