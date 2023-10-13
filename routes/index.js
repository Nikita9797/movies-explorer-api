const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const { signInValidation, signUnValidation } = require("../utils/validation");
const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const moviesRouter = require("./movies");
const NotFoundError = require("../errors/NotFoundError");

router.post("/signin", signInValidation, login);
router.post("/signup", signUnValidation, createUser);
router.get("/signout", (req, res) => {
  res.clearCookie("jwt").send({ message: "Токен удален" });
});

router.use("/users", auth, usersRouter);
router.use("/movies", auth, moviesRouter);

router.use("*", auth, (req, res, next) => {
  next(new NotFoundError("Invalid request address"));
});

module.exports = router;
