const nodemailer = require("nodemailer");
const { SMTPConfig } = require("../config/app.config");

class MailerService {
  #transport;

  constructor() {
    try {
      this.#transport = nodemailer.createTransport({
        host: SMTPConfig.smtpHost,
        port: Number(SMTPConfig.smtpPort) || 587,
        secure: Number(SMTPConfig.smtpPort) === 465,
        auth: {
          user: SMTPConfig.smtpUser,
          pass: SMTPConfig.smtpPassword,
        },
      });
    } catch (exception) {
      console.error("Mailer initialization error:", exception);
    }
  }

  async sendEmail({ to, subject, message }) {
    try {
      const mailOptions = {
        from: SMTPConfig.smtpFrom || SMTPConfig.smtpUser,
        to: to,
        subject: subject,
        html: message,
      };
      return await this.#transport.sendMail(mailOptions);
    } catch (exception) {
      console.error("Send mail error:", exception);
      throw {
        code: 500,
        message:
          "Error sending email: " + (exception.message || "Unknown error"),
        status: "EMAIL_SENDING_FAILED",
      };
    }
  }
}

const EmailService = new MailerService();
module.exports = EmailService;
