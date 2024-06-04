const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const axios = require("axios");
const { sendVerificationEmail } = require("../middleware/emailVerification");
const crypto = require("crypto");
const { log } = require("console");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authenticateToken = require("../middleware/authenticateToken");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const router = express.Router();

// for uploading a picture into the profile
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}


// Routes
router.post("/login", async (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  console.log("Login request body:", { email, password });

  try {
    const user = await User.findOne({ email: email });
    console.log("User found:", user ? "Yes" : "No", "for email:", email);
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "User does not exist" });
    }

    if (!user.emailVerified) {
      console.log("Email not verified:", email);
      return res.status(401).json({ message: "Email has not been verified" });
    }

    console.log("Email verified:", user.emailVerified ? "Yes" : "No");
    console.log("Password from request:", password);
    console.log("Stored hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(
      "Password comparison result:",
      isMatch ? "Match" : "No Match",
      "for user:",
      email
    );


    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    console.log("Login successful for:", email);
    // res.json({ token });
    res.json({
      token,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      isStudent: user.isStudent,
    });
  } catch (error) {
    console.error("Error on login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  console.log("Register endpoint hit");
  console.log("Request Body:", req.body);
  const { username, email, password, recaptchaResponse } = req.body;

  console.log("Register request body:", {
    username,
    email,
    password: "[REDACTED]",
    recaptchaResponse,
  });

  // reCAPTCHA response
  if (!recaptchaResponse) {
    return res.status(400).json({ message: "reCAPTCHA token missing" });
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const secretKey = "6LdKEZopAAAAAOub4fKWPTF2BeHi7kevR9e3kFR9"; 

    const recaptchaVerifyResponse = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: recaptchaResponse,
      },
    });

    if (!recaptchaVerifyResponse.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    console.log("User exists check:", userExists ? "Yes" : "No");
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or username" });
    }

    // User creation without hashing the password here because it's done in the pre-save hook
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = new User({
      username,
      email,
      password, // Directly passing the plain text password here
      verificationToken,
    });

    await user.save(); // The password will be hashed automatically by the pre-save hook
    console.log("User created and verification email sent.");

    sendVerificationEmail(email, verificationToken); // Ensure this function is implemented

    // JWT token creation and sending response
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({ token: authToken, message: "User successfully registered" });
  } catch (error) {
    console.error("Error during registration:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.get("/verify-email", async (req, res) => {
  console.log("hello from verify-email route");
  const { token } = req.query;
  console.log(`Received token for verification: ${token}`);
  try {
    // Find user by verification token
    console.log(`Received token for verification: ${token}`);
    const user = await User.findOne({ verificationToken: token });
    console.log(`User found with token: `, user ? "Yes" : "No");
    if (!user) {
      return res
        .status(400)
        .send("Verification failed. Invalid or expired token.");
    }

    // Update user to set email as verified
    user.emailVerified = true;
    user.verificationToken = ""; // Clear the verification token
    await user.save();
    console.log(
      `Email verified and user updated in database for: ${user.email}`
    );

    // Redirect the user to the login page after successful email verification
    res.json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send("Internal server error during email verification.");
  }
});

router.get("/profile/:username", async (req, res) => {
  console.log("Fetching profile for username:", req.params.username);
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      status: user.status,
      favorites: user.favorites,
      vision: user.vision,
      contact: user.contact,
      faq: user.faq,
      isStudent: user.isStudent,
      
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/upload/:username", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    } else {
      if (req.file == undefined) {
        return res.status(400).send("Error: No File Selected!");
      } else {
        const username = req.params.username;
        const newImagePath = `/uploads/${req.file.filename}`;

        try {
          const user = await User.findOne({ username: username });
          if (!user) {
            return res.status(404).send("User not found.");
          }

          // If there's an existing profileImage, delete the file
          if (user.profileImage) {
            const oldImagePath = path.join(
              __dirname,
              "../public",
              user.profileImage
            );
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr)
                console.error("Error deleting old image:", unlinkErr);
              else console.log("Old image deleted successfully.");
            });
          }

          // Update user document with new image path
          const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { $set: { profileImage: newImagePath } },
            { new: true }
          );

          res.send({
            message: "File uploaded and profile updated!",
            filePath: newImagePath,
            user: updatedUser,
          });
        } catch (error) {
          console.error("Database operation failed", error);
          res.status(500).send("Database operation failed.");
        }
      }
    }
  });
});

// Assuming authenticateToken is a middleware that verifies the user's token
router.post(
  "/profile/update/:username",
  authenticateToken,
  async (req, res) => {
    const { username } = req.params;
    const { bio, status, favorites, vision, contact, faq } = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { bio, status, favorites, vision, contact, faq },
        { new: true }
      );
      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Routes for verifying student status and update the user

router.get("/universities", async (req, res) => {
  const filePath = path.join(
    __dirname,
    "../data/world_universities_and_domains.json"
  );
  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Failed to read university data:", error);
    res.status(500).send("Failed to load university data.");
  }
});

let verificationCodes = {};

router.post("/send-verification", async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  verificationCodes[email] = verificationCode;

  console.log(`Verification code ${verificationCode} sent to: ${email}`);
  res.json({ message: "Verification code sent.", code: verificationCode });
});

router.post("/verify-code", async (req, res) => {
  const { code } = req.body;
  const email = Object.keys(verificationCodes).find(
    (key) => verificationCodes[key] === code
  );

  if (!email) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification code." });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { isStudent: true } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    delete verificationCodes[email];
    res.json({ message: "User verified as a student.", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// check if the user is already verified
router.get("/isVerified", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email query parameter is required." });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the isStudent status
    res.json({
      isVerified: user.isStudent,
      studentOfferUsed: user.studentOfferUsed,
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





router.patch("/useStudentOffer", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { studentOfferUsed: true } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "Offer used.", user });
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





router.get("/payment-details/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId,
      {
         // Correctly expand to get product details
        expand: ["line_items.data.price.product"],
      }
    );

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    // Accessing the first line item's product details for simplicity
    const product = session.line_items.data[0].price.product;
    const productDescription = product.description;
    const productImages = product.images;

    res.json({
      paymentIntent,
      productDescription,
      productImages,
    });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
