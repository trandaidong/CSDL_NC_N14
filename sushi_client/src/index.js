const express = require("express");
const port = 3000;
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const path = require("path");
const app = express();
const route = require(".\\routes");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Template engine

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "resources", "views", "layouts"), // Không thêm src vào đây nữa
    partialsDir: path.join(__dirname, "resources", "views", "partials"), // Cũng không thêm src vào đây
  })
);

app.set("view engine", "hbs");
app.set("views", "src\\resources\\views");

//routes
route(app);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
