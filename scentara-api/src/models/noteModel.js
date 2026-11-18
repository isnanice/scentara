import { supabase } from "../config/supabaseClient.js";

export const NoteModel = {
  // Filter opsional: category, search (nama note)
  async getAll({ category, search } = {}) {
    let query = supabase
      .from("notes")
      .select("id, name, category, description, perfume_notes ( count )")
      .order("name");

    if (category) query = query.eq("category", category);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    return data.map(({ perfume_notes, ...note }) => ({
      ...note,
      perfume_count: perfume_notes?.[0]?.count ?? 0,
    }));
  },

  async getCategories() {
    const { data, error } = await supabase.from("notes").select("category");
    if (error) throw error;

    const counts = {};
    for (const row of data) {
      counts[row.category] = (counts[row.category] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  // Detail note beserta parfum yang memakainya dan di layer mana
  async getById(id) {
    const { data, error } = await supabase
      .from("notes")
      .select(
        `id, name, category, description,
         perfume_notes (
           layer,
           perfumes ( id, name, concentration, image_url, price, scent_profiles, brands ( name, slug ) )
         )`
      )
      .eq("id", id)
      .single();
    if (error) throw error;

    const { perfume_notes, ...note } = data;
    const perfumes = (perfume_notes ?? [])
      .filter((row) => row.perfumes)
      .map((row) => ({ ...row.perfumes, layer: row.layer }));
    return { ...note, perfumes };
  },
};
