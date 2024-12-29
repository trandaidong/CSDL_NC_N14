module.exports.registerPost = (req, res, next) => { // next là hàm middlewere
    if (!req.body.fullname) {
        req.flash("error", "Please enter fullname!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Please enter email!");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Please enter password!");
        res.redirect("back");
        return;
    }
    next();// nếu đúng thì chuyển qua hàm tiếp theo trong router
}
module.exports.loginPost = (req, res, next) => { // next là hàm middlewere
    if (!req.body.email) {
        req.flash("error", "Please enter email!");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Please enter password!");
        res.redirect("back");
        return;
    }
    next();// nếu đúng thì chuyển qua hàm tiếp theo trong router
}
module.exports.loginPost = (req, res, next) => { // next là hàm middlewere
    if (!req.body.email) {
        req.flash("error", "Please enter email!");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Please enter password!");
        res.redirect("back");
        return;
    }
    next();// nếu đúng thì chuyển qua hàm tiếp theo trong router
}
module.exports.forgotPasswordPost = (req, res, next) => { // next là hàm middlewere
    if (!req.body.email) {
        req.flash("error", "Please enter email!");
        res.redirect("back");
        return;
    }
    next();// nếu đúng thì chuyển qua hàm tiếp theo trong router
}
module.exports.resetPasswordPost = (req, res, next) => { // next là hàm middlewere
    if (!req.body.password) {
        req.flash("error", "Please enter password!");
        res.redirect("back");
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Please confirm password!");
        res.redirect("back");
        return;
    }
    if (req.body.confirmPassword !== req.body.password) {
        req.flash("error", "Password do not match!");
        res.redirect("back");
        return;
    }
    next();// nếu đúng thì chuyển qua hàm tiếp theo trong router
}