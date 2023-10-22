const express = require("express");
const cntrl = require("../../controllers/auth");
const { validate } = require("../../validate/validate");
const { schemas } = require("../../models/user");
const { authenticate } = require("../../middlewares/authenticate");
const router = express.Router();

router.post("/register", validate(schemas.registerSchema), cntrl.register);
router.post("/login", validate(schemas.loginSchema), cntrl.login);

router.get("/current", authenticate, cntrl.getCurrent);
router.post("/logout", authenticate, cntrl.logout);

module.exports = router;
