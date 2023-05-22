// const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const {
  handle_new_member,
  get_all_members,
  get_one_member,
  delete_member,
  update_member,
  login_member
} = require("../controllers/member.controller");

const router = Router();

router.post("/signup", handle_new_member);

router.post("/login", login_member);

router.get("/", get_all_members);

router.get("/:id", get_one_member);

router.delete("/:id", delete_member);

router.put("/:id", update_member);

module.exports = router;
