const express = require("express");
const cntrl = require("../../controllers/auth");
const { validate } = require("../../validate/validate");
const { schemas } = require("../../models/user");
const { authenticate } = require("../../middlewares/authenticate");
const { upload } = require("../../middlewares/upload");
const router = express.Router();

router.post("/register", validate(schemas.registerSchema), cntrl.register);
router.post("/login", validate(schemas.loginSchema), cntrl.login);

router.get("/verify/:verificationToken", cntrl.verifyEmail);
router.post("/verify", validate(schemas.emailSchema), cntrl.resendVerifyEmail);

router.get("/current", authenticate, cntrl.getCurrent);
router.post("/logout", authenticate, cntrl.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  cntrl.updateAvatar
);

module.exports = router;
