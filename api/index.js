// 📦 Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./collections/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Place from "./collections/Place.js";
import Booking from "./collections/Booking.js";

// 🌍 Environment setup
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const jwtSecret = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function cloudinaryPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

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
        res.cookie("token", token, authCookieOptions).json(userDoc);
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
  res.cookie("token", "", authCookieOptions).json({ message: "Logged out" });
});

app.post("/upload-by-link", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err) => {
    if (err) return res.status(403).json("Token invalid");
    const { link } = req.body;
    try {
      const result = await cloudinary.uploader.upload(link, { folder: "airbnc" });
      res.json(result.secure_url);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
});

const photosMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 100 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});
app.post("/upload", (req, res) => {
  photosMiddleware.array("photos", 100)(req, res, async (multerErr) => {
    if (multerErr) return res.status(400).json({ error: multerErr.message });

    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err) => {
      if (err) return res.status(403).json("Token invalid");
      try {
        const results = await Promise.allSettled(
          req.files.map(async (file) => {
            const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
            const result = await cloudinary.uploader.upload(dataUri, { folder: "airbnc" });
            return result.secure_url;
          })
        );
        const uploadedUrls = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);
        if (uploadedUrls.length === 0 && req.files.length > 0) {
          return res.status(500).json({ error: "Failed to upload photos" });
        }
        res.json(uploadedUrls);
      } catch (error) {
        res.status(500).json({ error: "Failed to upload photos" });
      }
    });
  });
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

app.delete("/places/:id", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
    if (err) return res.status(403).json("Token invalid");
    try {
      const placeDoc = await Place.findById(req.params.id);
      if (!placeDoc) return res.status(404).json({ error: "Place not found" });
      if (decoded.id !== placeDoc.owner.toString()) {
        return res.status(403).json({ error: "Not authorized to delete this place" });
      }

      await Promise.all(
        (placeDoc.photos || [])
          .filter((photo) => photo.includes("res.cloudinary.com"))
          .map((photo) => {
            const publicId = cloudinaryPublicId(photo);
            return publicId
              ? cloudinary.uploader
                  .destroy(publicId)
                  .catch((err) => console.error("Cloudinary destroy failed:", publicId, err.message))
              : null;
          })
      );

      await Place.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

app.delete("/remove-photo", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
    if (err) return res.status(403).json("Token invalid");
    const { link } = req.body;
    if (typeof link !== "string" || !link) {
      return res.status(400).json({ error: "Missing link" });
    }

    try {
      const owningPlace = await Place.findOne({ photos: link });
      if (owningPlace && owningPlace.owner.toString() !== decoded.id) {
        return res.status(403).json({ success: false, error: "Not authorized to remove this photo" });
      }

      if (link.includes("res.cloudinary.com")) {
        const publicId = cloudinaryPublicId(link);
        if (publicId) await cloudinary.uploader.destroy(publicId);
        return res.json({ success: true });
      }

      // basename strips any path traversal segments so this can only resolve inside uploads/
      const filePath = path.join(__dirname, "uploads", path.basename(link));
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) return res.status(200).json({ success: false, message: "File already missing" });
        fs.unlink(filePath, (err) => {
          if (err) return res.status(500).json({ success: false, error: "Deletion failed" });
          res.json({ success: true });
        });
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Deletion failed" });
    }
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
