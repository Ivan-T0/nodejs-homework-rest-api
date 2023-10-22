const express = require("express");
const isValidId = require("../../middlewares/isValidId");
const { authenticate } = require("../../middlewares/authenticate");
const router = express.Router();
const cntrl = require("../../controllers/contacts");
const { validate } = require("../../validate/validate");
const schemas = require("../../schemas/contacts");

router.get("/", authenticate, cntrl.getAll);

router.get("/:id", authenticate, isValidId, cntrl.getContactById);

router.post("/", authenticate, validate(schemas.addSchema), cntrl.addContact);

router.delete("/:id", authenticate, isValidId, cntrl.removeContact);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validate(schemas.addSchema),
  cntrl.updateContact
);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validate(schemas.updateFavoriteSchema),
  cntrl.updateFavorite
);

module.exports = router;
