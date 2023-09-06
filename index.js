import express from "express";
import fs from "fs";
import mongoose from "mongoose";
import {
  registerValidator,
  loginValidator,
  postCreateValidator,
  cardCreateValidator,
} from "./validations/validations.js";
import {
  postController,
  userController,
  cardController,
} from "./Controllers/index.js";
import { checkAuth, validationsErrors } from "./utils/index.js";
import multer from "multer";
import cors from "cors";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();
//make a vault for documents
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//auth app's
app.post(
  "/auth/register",
  registerValidator,
  validationsErrors,
  userController.register
);
app.post(
  "/auth/login",
  loginValidator,
  validationsErrors,
  userController.login
);
app.get("/auth/me", checkAuth, userController.getMe);

app.get("/", (req, res) => {
  res.json("Hello");
});

//posts apps
app.post("/posts", checkAuth, postCreateValidator, postController.create);
app.delete("/posts/:id", checkAuth, postController.remove);
app.patch("/posts/:id", checkAuth, postController.update);

app.get("/posts/", postController.getAll);
app.get("/posts/new", postController.getNewsPosts);
app.get("/posts/popular", postController.getPopularPosts);

app.get("/posts/:id", postController.getOne);

app.get("/tags/:name", postController.getTagsPosts);

app.get("/tags/", postController.getLastTags);
app.get("/posts/tags", postController.getLastTags);

//cards apps
app.post("/cards", checkAuth, cardCreateValidator, cardController.create);
app.delete("/cards/:id", checkAuth, cardController.remove);
app.patch("/cards/:id", checkAuth, cardController.update);
app.get("/cards/", cardController.getAll);
app.get("/cards/:id", cardController.getOne);

app.listen(8000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
