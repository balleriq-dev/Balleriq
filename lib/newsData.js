import { supabase } from "./supabaseClient";

export async function getAllNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fehler beim Laden der News:", error);
    return [];
  }
  return data;
}

export async function getNewsBySlug(slug) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Fehler beim Laden des Artikels:", error);
    return null;
  }
  return data;
}
