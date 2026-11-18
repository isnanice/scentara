import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import perfumeRoutes from "./routes/perfumeRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import scentProfileRoutes from "./routes/scentProfileRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Scentara API",
    endpoints: [
      "GET /api/perfumes?brand=&scent=&search=",
      "GET /api/perfumes/:id",
      "GET /api/notes?category=&search=",
      "GET /api/notes/categories",
      "GET /api/notes/:id",
      "GET /api/brands",
      "GET /api/scent-profiles",
    ],
  });
});

app.use("/api/perfumes", perfumeRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/scent-profiles", scentProfileRoutes);

// Di Vercel, server dijalankan oleh platform sehingga tidak perlu listen().
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
