import { supabase } from "../config/supabaseClient.js";

export const ReviewModel = {
  // Ambil semua ulasan di platform beserta info parfum
  async getAll() {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, perfume_id, author, rating, comment, reviewer_id, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

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
  async create({ perfume_id, author, rating, comment, reviewer_id, image_url }) {
    const insertData = { perfume_id, author, rating, comment, reviewer_id };
    if (image_url) insertData.image_url = image_url;

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert(insertData)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      // Jika kolom image_url belum ada di Supabase, fallback tanpa image_url
      if (insertData.image_url) {
        delete insertData.image_url;
        const { data, error } = await supabase
          .from("reviews")
          .insert(insertData)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      throw err;
    }
  },

  // Update review berdasarkan id
  async update(id, { author, rating, comment, image_url }) {
    const updateData = { author, rating, comment, updated_at: new Date().toISOString() };
    if (image_url !== undefined) updateData.image_url = image_url;

    try {
      const { data, error } = await supabase
        .from("reviews")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      if (updateData.image_url !== undefined) {
        delete updateData.image_url;
        const { data, error } = await supabase
          .from("reviews")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      throw err;
    }
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

