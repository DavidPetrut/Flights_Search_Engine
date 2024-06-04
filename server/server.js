require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Existing mongoose and app configuration...
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", process.env.CLIENT_URL],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static("public/uploads"));

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.body.email,
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "GBP",
          product_data: {
            name: "Travel-Ease Ltd. - Flight Payment",
            images: [
              "https://images.pexels.com/photos/1251516/pexels-photo-1251516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
              "https://images.pexels.com/photos/11248224/pexels-photo-11248224.jpeg?auto=compress&cs=tinysrgb&w=1660&h=1150&dpr=1",
            ],
            description:
              "Your partner to Seamless and Memorable Journeys Worldwide. Your Dream Destinations Meet Unparalleled Convenience. Book Now for Stress-Free Adventures and Unforgettable Getaways! ",
          },
          unit_amount: item.priceInCents,
        },
        quantity: item.quantity,
      })),
      // success_url: `${process.env.CLIENT_URL}/success`,
      success_url: `${process.env.CLIENT_URL}/success?payment_intent_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ... existing flights creation router configuration ...
const flightsRouter = require("./routes/flights");
app.use("/flights", flightsRouter);

console.log("Registering routes...");
app.use("/api/users", userRoutes);
console.log("Routes registered.");

app.listen(process.env.PORT || 8001, () =>
  console.log("Server Started on port 8001")
);
