const { Router } = require("express");
const { z } = require("zod");
const { adminModel, postModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/authmiddleware");
const JWT_ADMIN_SECRET = "admin123";
const adminRouter = Router();

adminRouter.post("/signup", async function (req, res) {
  const requiredBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, "password should be more than 6 characters"),
  });

  const safeParsedData = requiredBody.safeParse(req.body);

  if (!safeParsedData.success) {
    res.json({
      message: "Incorrect Input format",
    });
    return;
  }

  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    await adminModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (e) {
    res.json({
      message: "something went wrong",
    });
  }

  res.json({
    message: "sign up successfully",
  });
});

adminRouter.post("/signin", async function (req, res) {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z.string().min(6, "password should be more than 6 characters"),
  });

  const safeParsedData = requiredBody.safeParse(req.body);

  if (!safeParsedData.success) {
    res.json({
      message: "Incorrect Input format",
    });
    return;
  }

  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      res.json({
        message: "admin not found",
      });
      return;
    }

    const isPasswordCorrect = bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      res.json({
        message: "Incorrect Credentials",
      });
      return;
    } else {
      const token = jwt.sign(
        {
          id: admin._id,
        },
        JWT_ADMIN_SECRET
      );

      res.json({
        token: token,
      });
    }
  } catch (e) {
    res.json({
      message: "something went wrong",
    });
  }
});

adminRouter.post("/create-post", authMiddleware, async function (req, res) {
    const { title, description } = req.body;
  
    try {
      const post = await postModel.create({
        title,
        description,
        author: req.adminId,
      });
  
      res.status(201).json({
        message: "Post created successfully",
        postId: post._id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create post",
        error: error.message,
      });
    }
  });
  
module.exports = {
  adminRouter: adminRouter,
};
