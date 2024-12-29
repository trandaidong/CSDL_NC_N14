const menuRouter = require(".\\menu");
const homeRouter = require(".\\home");
const recruitRouter = require(".\\recruit");
const albumRouter = require(".\\album");

const shopping_cartRouter = require(".\\shopping_cart");
const paymentRouter = require(".\\payment");
const reserveRouter = require(".\\reserveOnline");
const loginRouter = require(".\\login_routes\\login_route");
const forgetRouter = require(".\\login_routes\\forget_route");
const registerRouter = require(".\\login_routes\\register_route");

function route(app) {
  app.use("/menu", menuRouter);
  app.use("/recruit", recruitRouter);
  app.use("/album", albumRouter);
  app.use("/shopping_cart", shopping_cartRouter);
  app.use("/paymentonline", paymentRouter);
  app.use("/reserveOnline",reserveRouter)
  app.use("/", homeRouter);
  app.use("/", loginRouter);
  app.use("/", forgetRouter);
  app.use("/", registerRouter);
}
module.exports = route;
