const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({ ...msg, from: "akulba@meta.ua" });
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_NODEMAILER, // generated ethereal user
        pass: process.env.PASSWORD_NODEMAILER, // generated ethereal password
      },
    };

    const transporter = nodemailer.createTransport(config);
    console.log(transporter);
    return await transporter.sendMail({
      ...msg,
      from: process.env.EMAIL_NODEMAILER,
    });
  }
}

module.exports = { CreateSenderSendGrid, CreateSenderNodemailer };
