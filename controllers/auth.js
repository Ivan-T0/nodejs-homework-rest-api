const { User } = require("../models/user");
const bcryptjs = require("bcrypt");
const { cntrlWrapper, HttpError } = require("../helpers");
const { sendEmail } = require("../helpers");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const { nanoid } = require("nanoid");
const { BASE_URL } = process.env;
const fs = require("fs/promises");
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "this email is already in use");
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "200" });
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify ",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}" >Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "verification token not found");
  }
  await User.findByIdAndUpdate(user._id, { verify: true });
  res.json({
    message: "verification success",
  });
};
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "email not found");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify ",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}" >Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({
    message: "verification success",
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "email or password invalid");
  }
  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
  });
};
const logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.json({
    message: "logout success",
  });
};
const getCurrent = async (req, res) => {
  res.status(204).json();
};
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

module.exports = {
  register: cntrlWrapper(register),
  login: cntrlWrapper(login),
  getCurrent: cntrlWrapper(getCurrent),
  logout: cntrlWrapper(logout),
  updateAvatar: cntrlWrapper(updateAvatar),
  verifyEmail: cntrlWrapper(verifyEmail),
  resendVerifyEmail: cntrlWrapper(resendVerifyEmail),
};
