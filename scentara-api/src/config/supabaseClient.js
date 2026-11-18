import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("SUPABASE_URL atau SUPABASE_KEY belum diisi di file .env");
}

export const supabase = createClient(
  supabaseUrl || "http://localhost",
  supabaseKey || "missing-key"
);
