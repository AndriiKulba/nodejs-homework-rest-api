const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
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
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: {},
  }
);

contactSchema.virtual("info").get(function () {
  return `${this.name} tel: ${this.phone} e-mail: ${this.email}`;
});

const Contact = model("contact", contactSchema);

module.exports = Contact;
