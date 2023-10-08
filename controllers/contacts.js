const contacts = require("../models/contacts");
const { cntrlWrapper,HttpError } = require("../helpers");


const getAll = async (req, res) => {
  const result = await contacts.listContacts();
  console.log(result);
  res.json(result);
};
const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await contacts.getContactById(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};
const addContact = async (req, res) => {
 
  const result = await contacts.addContact(req.body);

  res.status(201).json(result);
};
const removeContact = async (req, res) => {
  const { id } = req.params;

  const result = await contacts.removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Delete success",
  });
};
const updateContact = async (req, res) => {

  const { id } = req.params;
  const result = await contacts.updateContact(id, req.body);
  res.json(result);
};

module.exports = {
  getAll: cntrlWrapper(getAll),
  getContactById: cntrlWrapper(getContactById),
  addContact: cntrlWrapper(addContact),
  removeContact: cntrlWrapper(removeContact),
  updateContact: cntrlWrapper(updateContact),
};
