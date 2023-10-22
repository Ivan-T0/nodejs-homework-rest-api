const Contact = require("../models/contact");
const { cntrlWrapper, HttpError } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-__v", { skip, limit });
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};
const addContact = async (req, res) => {
  const { id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};
const removeContact = async (req, res) => {
  const { id } = req.params;

  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Delete success",
  });
};
const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  res.json(result);
};
const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  const result = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );
  res.json(result);
};

module.exports = {
  getAll: cntrlWrapper(getAll),
  getContactById: cntrlWrapper(getContactById),
  addContact: cntrlWrapper(addContact),
  removeContact: cntrlWrapper(removeContact),
  updateContact: cntrlWrapper(updateContact),
  updateFavorite: cntrlWrapper(updateFavorite),
};
