import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { 
  initialProfile, 
  initialLayanan, 
  initialProses, 
  initialRegulasi, 
  initialBerita, 
  initialFAQ, 
  initialKontak, 
  initialSyncConfig, 
  initialSyncLogs 
} from "./src/mockData";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "database.json");

// Helper to load or initialize DB
function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      profile: initialProfile,
      layanan: initialLayanan,
      proses: initialProses,
      regulasi: initialRegulasi,
      berita: initialBerita,
      faq: initialFAQ,
      kontak: initialKontak,
      syncConfig: initialSyncConfig,
      syncLogs: initialSyncLogs
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), "utf8");
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse database.json, rebuilding default DB", err);
    const defaultData = {
      profile: initialProfile,
      layanan: initialLayanan,
      proses: initialProses,
      regulasi: initialRegulasi,
      berita: initialBerita,
      faq: initialFAQ,
      kontak: initialKontak,
      syncConfig: initialSyncConfig,
      syncLogs: initialSyncLogs
    };
    return defaultData;
  }
}

// Helper to write DB
function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save database.json", err);
  }
}

async function startServer() {
  const app = express();

  // Permissive CORS middleware for cross-origin sync with landing pages like LPH Al-Ghazali 1
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-LPH-Token, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));

  // API v1 Endpoints Base
  
  // Get all categories in one simple endpoint (highly useful for landing pages)
  app.get("/api/v1/all", (req, res) => {
    const db = loadDatabase();
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: db
    });
  });

  // Bulk update / sync from the admin system
  app.post("/api/v1/sync", (req, res) => {
    const incoming = req.body;
    const db = loadDatabase();

    if (incoming.profile) db.profile = incoming.profile;
    if (incoming.layanan) db.layanan = incoming.layanan;
    if (incoming.proses) db.proses = incoming.proses;
    if (incoming.regulasi) db.regulasi = incoming.regulasi;
    if (incoming.berita) db.berita = incoming.berita;
    if (incoming.faq) db.faq = incoming.faq;
    if (incoming.kontak) db.kontak = incoming.kontak;
    if (incoming.syncConfig) db.syncConfig = incoming.syncConfig;
    if (incoming.syncLogs) db.syncLogs = incoming.syncLogs;

    // Add automatic server-side log
    const timestampStr = new Date().toISOString();
    const newLog = {
      id: `log_server_${Date.now()}`,
      timestamp: timestampStr,
      tipeOperasi: "REWRITE_FULL_DB",
      entitas: "Semua Kategori",
      status: "Berhasil",
      pesan: `Sinkronisasi Penuh (Full CRUD Sync) diproses di server port 3000 dari IP: ${req.ip}.`
    };
    db.syncLogs = [newLog, ...(db.syncLogs || [])].slice(0, 50);

    saveDatabase(db);
    res.json({
      status: "success",
      message: "Berhasil menyinkronkan seluruh database sistem LPH Al-Ghazali.",
      updatedAt: timestampStr,
      log: newLog
    });
  });

  // Profiles Module API
  app.get("/api/v1/profile", (req, res) => {
    const db = loadDatabase();
    res.json(db.profile);
  });
  app.post("/api/v1/profile", (req, res) => {
    const db = loadDatabase();
    db.profile = { ...db.profile, ...req.body };
    saveDatabase(db);
    res.json({ status: "success", data: db.profile });
  });

  // Layanan Module API
  app.get("/api/v1/layanan", (req, res) => {
    const db = loadDatabase();
    res.json(db.layanan);
  });
  app.post("/api/v1/layanan", (req, res) => {
    const db = loadDatabase();
    const item = req.body;
    
    // Check if the item already exists to update it, or push new
    const idx = db.layanan.findIndex((l: any) => l.id === item.id);
    if (idx !== -1) {
      db.layanan[idx] = item;
    } else {
      if (!item.id) item.id = `srv_${Date.now()}`;
      db.layanan.unshift(item);
    }
    
    saveDatabase(db);
    res.json({ status: "success", data: item });
  });
  app.delete("/api/v1/layanan/:id", (req, res) => {
    const db = loadDatabase();
    db.layanan = db.layanan.filter((l: any) => l.id !== req.params.id);
    saveDatabase(db);
    res.json({ status: "success", message: `Layanan ${req.params.id} dihapus.` });
  });

  // Proses / Alur Module API
  app.get("/api/v1/proses", (req, res) => {
    const db = loadDatabase();
    res.json(db.proses);
  });
  app.post("/api/v1/proses", (req, res) => {
    const db = loadDatabase();
    const item = req.body;

    const idx = db.proses.findIndex((p: any) => p.id === item.id);
    if (idx !== -1) {
      db.proses[idx] = item;
    } else {
      if (!item.id) item.id = `proc_${Date.now()}`;
      db.proses.push(item);
    }

    saveDatabase(db);
    res.json({ status: "success", data: item });
  });
  // Batch updates for process re-ordering
  app.post("/api/v1/proses/reorder", (req, res) => {
    const db = loadDatabase();
    if (Array.isArray(req.body)) {
      db.proses = req.body;
      saveDatabase(db);
      res.json({ status: "success", data: db.proses });
    } else {
      res.status(400).json({ error: "Saran array kosong atau tidak valid." });
    }
  });
  app.delete("/api/v1/proses/:id", (req, res) => {
    const db = loadDatabase();
    db.proses = db.proses.filter((p: any) => p.id !== req.params.id);
    saveDatabase(db);
    res.json({ status: "success", message: `Proses ${req.params.id} dihapus.` });
  });

  // Regulasi Module API
  app.get("/api/v1/regulasi", (req, res) => {
    const db = loadDatabase();
    res.json(db.regulasi);
  });
  app.post("/api/v1/regulasi", (req, res) => {
    const db = loadDatabase();
    const item = req.body;

    const idx = db.regulasi.findIndex((r: any) => r.id === item.id);
    if (idx !== -1) {
      db.regulasi[idx] = item;
    } else {
      if (!item.id) item.id = `reg_${Date.now()}`;
      db.regulasi.unshift(item);
    }

    saveDatabase(db);
    res.json({ status: "success", data: item });
  });
  app.delete("/api/v1/regulasi/:id", (req, res) => {
    const db = loadDatabase();
    db.regulasi = db.regulasi.filter((r: any) => r.id !== req.params.id);
    saveDatabase(db);
    res.json({ status: "success", message: `Regulasi ${req.params.id} dihapus.` });
  });

  // Berita Module API
  app.get("/api/v1/berita", (req, res) => {
    const db = loadDatabase();
    res.json(db.berita);
  });
  app.post("/api/v1/berita", (req, res) => {
    const db = loadDatabase();
    const item = req.body;

    const idx = db.berita.findIndex((b: any) => b.id === item.id);
    if (idx !== -1) {
      db.berita[idx] = item;
    } else {
      if (!item.id) item.id = `news_${Date.now()}`;
      db.berita.unshift(item);
    }

    saveDatabase(db);
    res.json({ status: "success", data: item });
  });
  app.delete("/api/v1/berita/:id", (req, res) => {
    const db = loadDatabase();
    db.berita = db.berita.filter((b: any) => b.id !== req.params.id);
    saveDatabase(db);
    res.json({ status: "success", message: `Berita ${req.params.id} dihapus.` });
  });

  // FAQ Module API
  app.get("/api/v1/faq", (req, res) => {
    const db = loadDatabase();
    res.json(db.faq);
  });
  app.post("/api/v1/faq", (req, res) => {
    const db = loadDatabase();
    const item = req.body;

    const idx = db.faq.findIndex((f: any) => f.id === item.id);
    if (idx !== -1) {
      db.faq[idx] = item;
    } else {
      if (!item.id) item.id = `faq_${Date.now()}`;
      db.faq.unshift(item);
    }

    saveDatabase(db);
    res.json({ status: "success", data: item });
  });
  app.delete("/api/v1/faq/:id", (req, res) => {
    const db = loadDatabase();
    db.faq = db.faq.filter((f: any) => f.id !== req.params.id);
    saveDatabase(db);
    res.json({ status: "success", message: `FAQ ${req.params.id} dihapus.` });
  });

  // Kontak Inbox (Post dari Landing Page LPH Al-Ghazali 1)
  app.get("/api/v1/kontak", (req, res) => {
    const db = loadDatabase();
    res.json(db.kontak);
  });
  // Landing Page triggers this endpoint to write user questions into the dashboard
  app.post("/api/v1/kontak", (req, res) => {
    const db = loadDatabase();
    const item = req.body;

    if (!item.id) item.id = `msg_${Date.now()}`;
    if (item.telahDibaca === undefined) item.telahDibaca = false;
    if (!item.tanggalMasuk) item.tanggalMasuk = new Date().toISOString().split("T")[0];

    db.kontak = [item, ...(db.kontak || [])];
    saveDatabase(db);
    res.json({
      status: "success",
      message: "Terima kasih! Pesan konsultasi atau pertanyaan Anda berhasil dikirim ke Pengurus LPH Al-Ghazali.",
      data: item
    });
  });
  app.patch("/api/v1/kontak/:id", (req, res) => {
    const db = loadDatabase();
    const idx = db.kontak.findIndex((k: any) => k.id === req.params.id);
    if (idx !== -1) {
      db.kontak[idx] = { ...db.kontak[idx], ...req.body };
      saveDatabase(db);
      res.json({ status: "success", data: db.kontak[idx] });
    } else {
      res.status(404).json({ error: "Pesan tidak ditemukan." });
    }
  });
  app.delete("/api/v1/kontak/:id", (req, res) => {
    const db = loadDatabase();
    db.kontak = db.kontak.filter((k: any) => k.id !== req.params.id);
    saveDatabase(db);
    res.json({ status: "success", message: `Pesan ${req.params.id} dihapus.` });
  });

  // Vite static assets serving & spa router bindings
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LPH API DATABASE SERVER] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
