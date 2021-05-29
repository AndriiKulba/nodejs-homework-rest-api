const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");

const {
  validationAddContact,
  validationUpdateContact,
  validationStatusContact,
  validateMongoId,
} = require("./validation");

router
  .get("/", ctrl.listContacts)
  .post("/", validationAddContact, ctrl.addContact);

router
  .get("/:contactId", validateMongoId, ctrl.getContactById)
  .delete("/:contactId", validateMongoId, ctrl.removeContact)
  .put(
    "/:contactId",
    validateMongoId,
    validationUpdateContact,
    ctrl.updateContact
  );

router.patch(
  "/:contactId/favorite",
  validateMongoId,
  validationStatusContact,
  ctrl.updateContact
);

module.exports = router;
