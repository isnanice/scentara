import { supabase } from "../config/supabaseClient.js";

export const ScentProfileModel = {
  // Daftar profil aroma beserta jumlah parfum yang memakainya
  async getAll() {
    const { data, error } = await supabase
      .from("perfumes")
      .select("scent_profiles");
    if (error) throw error;

    const counts = {};
    for (const row of data) {
      for (const profile of row.scent_profiles ?? []) {
        counts[profile] = (counts[profile] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  },
};
