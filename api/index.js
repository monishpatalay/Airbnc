// 📦 Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./collections/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import Place from "./collections/Place.js";
import Booking from "./collections/Booking.js";

// 🌍 Environment setup
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const jwtSecret = process.env.JWT_SECRET;

// 🔐 Utility function
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (!token) return reject(new Error("No token found in cookies"));

    jwt.verify(token, jwtSecret, {}, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

// 🔧 Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://airbnc-puce.vercel.app"],
  })
);

// 🛢️ MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// 🛣️ Routes
app.get("/test", (req, res) => res.send("Hello World"));

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, await bcrypt.genSalt(10));
    const userDoc = await User.create({ name, email, password: hashedPassword });
    res.json(userDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(404).json("User not found");

    const isPassValid = bcrypt.compareSync(password, userDoc.password);
    if (!isPassValid) return res.status(401).json("Invalid password");

    jwt.sign(
      { id: userDoc._id, email: userDoc.email },
      jwtSecret,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) return res.status(500).json("Token error");
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" }).json(userDoc);
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json("No token");

  jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
    if (err) return res.status(403).json("Token invalid");
    const userDoc = await User.findById(decoded.id);
    if (!userDoc) return res.status(404).json("User not found");
    res.json({ name: userDoc.name, email: userDoc.email, _id: userDoc._id });
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true }).json({ message: "Logged out" });
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  try {
    await imageDownloader.image({ url: link, dest: path.join(__dirname, "uploads", newName) });
    res.json(newName);
  } catch (error) {
    console.error("Image download failed:", error);
    res.status(500).json({ error: "Failed to download image" });
  }
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = req.files.map((file) => {
    const ext = file.originalname.split(".").pop();
    const newPath = file.path + "." + ext;
    fs.renameSync(file.path, newPath);
    return newPath.replace("uploads/", "");
  });
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
    if (err) return res.status(403).json("Token invalid");
    const { title, address, description, addedPhotos, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
    try {
      const placeDoc = await Place.create({
        owner: decoded.id,
        title,
        address,
        description,
        photos: addedPhotos,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      res.json(placeDoc);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
    if (err) return res.status(403).json("Token invalid");
    res.json(await Place.find({ owner: decoded.id }));
  });
});

app.get("/places/:id", async (req, res) => {
  res.json(await Place.findById(req.params.id));
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
    if (err) return res.status(403).json("Token invalid");
    const { id, title, address, description, addedPhotos, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
    const placeDoc = await Place.findById(id);
    if (!placeDoc) return res.status(404).json("Place not found");
    if (decoded.id === placeDoc.owner.toString()) {
      placeDoc.set({ title, address, description, photos: addedPhotos, perks, extraInfo, checkIn, checkOut, maxGuests, price });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.delete("/remove-photo", (req, res) => {
  const { link } = req.body;
  const filePath = path.join(__dirname, "uploads", link);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return res.status(200).json({ success: false, message: "File already missing" });
    fs.unlink(filePath, (err) => {
      if (err) return res.status(500).json({ success: false, error: "Deletion failed" });
      res.json({ success: true });
    });
  });
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, price, checkOut, noOfGuests, name, mobile } = req.body;
    if (!place || !checkIn || !checkOut || !noOfGuests || !name || !mobile) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const bookingDoc = await Booking.create({
      place,
      checkIn,
      checkOut,
      noOfGuests,
      name,
      price,
      mobile,
      user: userData.id,
    });
    res.json(bookingDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({ user: userData.id }).populate("place");
    res.json(bookings);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/bookings/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("place");
  if (!booking) return res.status(404).json({ error: "Not found" });
  res.json(booking);
});

// 🚀 Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
