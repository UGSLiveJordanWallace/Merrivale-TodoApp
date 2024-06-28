"use server";
import { createClient } from "./supabase/server";

export async function update(id, is_complete) {
	const supabase = createClient();
    const { data, error } = await supabase
        .from("todos")
        .update({ is_complete: is_complete })
        .eq("id", id);
    if (error) {
        return { error: "Something Went Wrong", error_message: error };
    }
    return { success: "Successfully Updated Item", data: data };
}

export async function deleteItem(id) {
	const supabase = createClient();
    const { data, error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
        return { error: "Something Went Wrong" };
    }
    return { success: "Successfully Deleted Item" };
}

export async function updateItems(listData) {
	const supabase = createClient();
    for (let i = 0; i < listData.length; i++) {
        if (listData[i].id) {
            const { data, error } = await supabase
                .from("todos")
                .update({ task: listData[i].task })
                .eq("id", listData[i].id);
            if (error) {
                console.log(error);
                return { error: "Something Went Wrong", error_message: error };
            }
        } else {
            const { data, error } = await supabase
                .from("todos")
                .insert(listData[i]);
            if (error) {
                console.log(error);
                return { error: "Something Went Wrong", error_message: error };
            }
        }
    }
    return { success: "Successfully Edited List" };
}

export async function deleteItems(name) {
	const supabase = createClient();

	const { data: d1, error: e1 } = await supabase.from("todos").delete().eq("name", name);
    if (e1) {
        return { error: "Something Went Wrong", error_message: e1 };
    }

	const { data: d2, error: e2 } = await supabase.from("tablenames").delete().eq("table_name", name);
	if (e2) {
        return { error: "Something Went Wrong", error_message: e2 };
	}

	return { success: "Successfully Deleted List" };
}

export async function createList(name) {
	const supabase = createClient();
    const { data, error } = await supabase
        .from("tablenames")
        .insert({ table_name: name });
    if (error) {
        return { error: "Something Went Wrong", error_message: error };
    }
    return { success: "Successfully Created List", data: data };
}

export async function clearCompleted(name) {
	const supabase = createClient();
    const { data, error } = await supabase
		.from("todos")
		.update({ is_complete: false })
		.eq("name", name);
	if (error) {
        return { error: "Something Went Wrong", error_message: error };
	}
	return { success: "Successfully Cleared List" };
}

export async function getListData(name) {
	const supabase = createClient();
	return await supabase.from("todos").select().eq("name", name);
}
