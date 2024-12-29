module.exports.updatePost = (req, res, next) => { // next là hàm middlewere
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
    next();// nếu đúng thì chuyển qua hàm tiếp theo trong router
}