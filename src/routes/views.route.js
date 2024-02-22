import { Router } from "express";
import Users from "../dbmanager/dbmanager.js";
import { passportCall } from "../utils.js";

const usersManager = new Users();
const router = Router();

router.get("/", (req, res) => {
  res.render("login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/perfil", passportCall("jwt"), async (req, res) => {
  let user = await usersManager.getBy({ email: req.user.email });
  res.render("perfil", {
    user,
  });
});

export default router;
