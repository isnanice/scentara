// Kode PGRST116 dari PostgREST berarti data tidak ditemukan.
export function sendError(res, err) {
  if (err?.code === "PGRST116") {
    return res.status(404).json({ error: "Data tidak ditemukan" });
  }
  return res.status(500).json({ error: err.message });
}
