const systemConfig = require('../../../../config/system');
// Middlewares
const authMiddleware = require('../../middlewares/admin/auth.middleware');

// Routers
const authRouter = require('./auth.router');
const dishRouters = require('./dish.router');
const scoreRouters=require('./score.router');
const branchRouters = require('./branch.router');
const invoiceRouters = require('./invoice.router');
const orderSlipRouter=require('./order-slip.router');
const customerRouters = require('./customer.router');
const employeeRouters = require('./employee.router');
const dashboardRoutes = require('./dashboard.router');
const statisticalRouters = require('./statistical.router');
const customerCardsRouters = require('./customer-cards.router');

// Controllers
const controller = require('../../controllers/admin/auth.controller')

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin + `/api/v1`;

    app.get(PATH_ADMIN, controller.login);

    app.use(PATH_ADMIN + '/auth', authRouter);

    app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth, dashboardRoutes);

    app.use(PATH_ADMIN + "/dishs", authMiddleware.requireAuth, dishRouters);

    app.use(PATH_ADMIN + "/branchs", authMiddleware.requireAuth, branchRouters);

    app.use(PATH_ADMIN + "/employees", authMiddleware.requireAuth, employeeRouters);

    app.use(PATH_ADMIN + '/customers', authMiddleware.requireAuth, customerRouters);

    app.use(PATH_ADMIN + '/statistical', authMiddleware.requireAuth, statisticalRouters);

    app.use(PATH_ADMIN + "/customer-cards", authMiddleware.requireAuth, customerCardsRouters);

    app.use(PATH_ADMIN + '/invoices', authMiddleware.requireAuth, invoiceRouters);
    
    app.use(PATH_ADMIN + '/order-slips', authMiddleware.requireAuth, orderSlipRouter);

    app.use(PATH_ADMIN + "/scores", authMiddleware.requireAuth, scoreRouters)
    //app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRouters);

    //app.use(PATH_ADMIN + '/products-category', authMiddleware.requireAuth, productCategoryRouter);

    //app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, rolesRouter);

    //app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accountsRouter);

    //app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, mAccountRouter)

    //app.use(PATH_ADMIN + '/settings', authMiddleware.requireAuth, settingRouter)
}