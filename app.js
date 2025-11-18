const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Routes
app.use("/", require("./routes/index"));
app.use("/inv", require("./routes/inventory"));

// 404 Error handler
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

// Global error handler
app.use(async (error, req, res, next) => {
  let nav = '';
  try {
    const utilities = require('./utilities');
    nav = await utilities.getNav();
  } catch (e) {
    nav = '<nav class=\"navbar\"><ul><li><a href=\"/\" title=\"Home\">Home</a></li></ul></nav>';
  }
  
  res.status(error.status || 500);
  res.render("error", {
    title: error.status === 404 ? "Page Not Found" : "Server Error",
    message: error.message,
    nav: nav
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
