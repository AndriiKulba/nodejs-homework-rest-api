const { expectCt } = require("helmet");
const { updateContact } = require("../controllers/contacts");

const Contacts = require("../repositiries/contacts");

jest.mock("../repositiries/contacts");

describe("Unit test controller contacts", () => {
  const req = { user: { id: 1 }, body: {}, params: { id: 1 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();
  it("test update contacts exist", async () => {
    const contact = {
      id: 4,
      name: "Cyrus Jackson",
      email: "nibh@semsempererat.com",
      phone: "(501) 472-5218",
    };
    Contacts.updateContact = jest.fn(() => {
      return contact;
    });
    const result = await updateContact(req, res, next);
    expect(result).toBeDefined();
    expect(result.status).toEqual("success");
    expect(result.code).toEqual(200);
    expect(result.data.contact).toEqual(contact);
  });

  it("test update contact not exist", async () => {
    Contacts.updateContact = jest.fn();
    const result = await updateContact(req, res, next);
    expect(result).toBeDefined();
    expect(result.status).toEqual("error");
    expect(result.code).toEqual(404);
    expect(result.message).toEqual("Not found");
  });
  it("test update contact:repositories return Error", async () => {
    Contacts.updateContact = jest.fn(() => {
      throw new Error("Ups");
    });
    await updateContact(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
