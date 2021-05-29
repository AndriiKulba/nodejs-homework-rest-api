const Contacts = require("../repositiries/contacts");

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    res.json({ status: "success", code: "200", data: { contacts } });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      console.log(contact);
      return res.json({ status: "success", code: "200", data: { contact } });
    }
    return res.json({ status: "error", code: "404", message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status("201")
      .json({ status: "success", code: "201", data: { contact } });
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);

    if (contact) {
      await Contacts.removeContact(req.params.contactId);
      return res.json({
        status: "success",
        code: "200",
        message: "contact deleted",
      });
    }
    return res.json({ status: "error", code: "404", message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res.json({ status: "success", code: "200", data: { contact } });
    }
    return res.json({ status: "error", code: "404", message: "Not found" });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
