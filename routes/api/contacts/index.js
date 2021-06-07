const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

const {
  validationAddContact,
  validationUpdateContact,
  validationStatusContact,
  validateMongoId,
} = require("./validation");

router
  .get("/", guard, ctrl.listContacts)
  .post("/", guard, validationAddContact, ctrl.addContact);

router
  .get("/:contactId", guard, validateMongoId, ctrl.getContactById)
  .delete("/:contactId", guard, validateMongoId, ctrl.removeContact)
  .put(
    "/:contactId",
    guard,
    validateMongoId,
    validationUpdateContact,
    ctrl.updateContact
  );

router.patch(
  "/:contactId/favorite",
  guard,
  validateMongoId,
  validationStatusContact,
  ctrl.updateContact
);

module.exports = router;
