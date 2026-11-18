import { supabase } from "../config/supabaseClient.js";

const LIST_FIELDS =
  "id, name, concentration, scent_profiles, description, image_url, price, source_url";

export const PerfumeModel = {
  // Filter opsional: brand (slug), scent (nama profil aroma), search (nama parfum)
  async getAll({ brand, scent, search } = {}) {
    const brandJoin = brand
      ? "brands!inner ( id, name, slug )"
      : "brands ( id, name, slug )";

    let query = supabase
      .from("perfumes")
      .select(`${LIST_FIELDS}, ${brandJoin}`)
      .order("name");

    if (brand) query = query.eq("brands.slug", brand);
    if (scent) query = query.contains("scent_profiles", [scent]);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Detail parfum beserta piramida notes (top, middle, base)
  async getById(id) {
    const { data, error } = await supabase
      .from("perfumes")
      .select(
        `${LIST_FIELDS},
         brands ( id, name, slug, website ),
         perfume_notes ( layer, notes ( id, name, category ) )`
      )
      .eq("id", id)
      .single();
    if (error) throw error;

    const { perfume_notes, ...perfume } = data;
    const notes = { top: [], middle: [], base: [] };
    for (const row of perfume_notes ?? []) {
      if (row.notes && notes[row.layer]) notes[row.layer].push(row.notes);
    }
    return { ...perfume, notes };
  },
};
