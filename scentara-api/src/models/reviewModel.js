import { supabase } from "../config/supabaseClient.js";

export const ReviewModel = {
  // Ambil semua review untuk satu parfum, urutkan dari terbaru
  async getByPerfumeId(perfumeId) {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, perfume_id, author, rating, comment, reviewer_id, created_at, updated_at")
      .eq("perfume_id", perfumeId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Tambah review baru
  async create({ perfume_id, author, rating, comment, reviewer_id }) {
    const { data, error } = await supabase
      .from("reviews")
      .insert({ perfume_id, author, rating, comment, reviewer_id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update review berdasarkan id
  async update(id, { author, rating, comment }) {
    const { data, error } = await supabase
      .from("reviews")
      .update({ author, rating, comment, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Hapus review berdasarkan id
  async delete(id) {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  },
};

