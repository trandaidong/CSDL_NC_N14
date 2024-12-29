class RecruitController {
  index(req, res) {
    res.render("recruit", { layout: "main" });
  }
}

module.exports = new RecruitController();
