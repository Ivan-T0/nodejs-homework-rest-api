
const {handleMongooseModel } = require("../helpers")
const { Schema, model } = require("mongoose")
const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});
contactSchema.post("save",handleMongooseModel )

const Contact = model("contact", contactSchema)
module.exports = Contact;