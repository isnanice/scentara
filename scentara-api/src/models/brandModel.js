import { supabase } from "../config/supabaseClient.js";

export const BrandModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("brands")
      .select("id, name, slug, description, website, perfumes ( count )")
      .order("name");
    if (error) throw error;

    return data.map(({ perfumes, ...brand }) => ({
      ...brand,
      perfume_count: perfumes?.[0]?.count ?? 0,
    }));
  },
};
