const bcrypt = require("bcryptjs");
const cloudinaryService = require("../../services/cloudinary.service");
const generateRandomString = require("../../utilities/randomStringGenerator");

class AuthService {
  async transformForUser(req) {
    try {
      const data = req.body;
      data.password = bcrypt.hashSync(data.password, 12);
      if (req.file) {
        data.image = await cloudinaryService.singlefileUpload(
          req.file.path,
          "/user",
        );
      }
      data.token = generateRandomString();
      data.expiryTime = new Date(Date.now() + 86400000);
      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async AccActivationEmail(user) {
    try {
      const displayName = (user.name && user.name.trim()) || "User";
      const expiry = user.expiryTime
        ? new Date(user.expiryTime).toLocaleString()
        : "24 hours";
      const activationUrl = `http://localhost:5173/activate/${user.token}`;

      return await EmailService.sendEmail({
        to: user.email,
        subject: "Activate your account",
        message: `<!doctype html>
        <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
      <tr>
        <td style="padding:24px;text-align:center;border-bottom:1px solid #eef0f2;">
          <h1 style="margin:0;color:#0b2545;font-size:20px;font-weight:600;">Activate your account</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;color:#475569;">
          <p style="margin:0 0 12px 0;font-size:15px;line-height:1.5;color:#334155;">Hello ${displayName},</p>
          <p style="margin:0 0 18px 0;font-size:15px;line-height:1.6;color:#334155;">
        Thanks for creating an account with us using ${user.email}. To complete your registration and gain full access, please activate your account by clicking the button below. This link will expire on <strong>${expiry}</strong>.
          </p>

          <div style="text-align:center;margin:18px 0;">
        <a href="${activationUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 22px;background:#1e90ff;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">
          Activate Account
        </a>
          </div>

          <p style="margin:0 0 12px 0;font-size:13px;color:#6b7280;">
        If the button above does not work, copy and paste the following link into your browser:
          </p>
          <p style="word-break:break-all;margin:0 0 18px 0;font-size:13px;color:#0b2545;">
        <a href="${activationUrl}" target="_blank" rel="noopener" style="color:#1e90ff;text-decoration:underline;">
          ${activationUrl}
        </a>
          </p>

          <p style="margin:0 0 18px 0;font-size:13px;color:#6b7280;">
        Please note: this activation link is valid until <strong>${expiry}</strong>.
          </p>

          <p style="margin:0;font-size:15px;color:#334155;">
        If you did not sign up for this account or need assistance, reply to this email and we'll help you out.
          </p>

          <p style="margin:22px 0 0 0;font-size:14px;color:#475569;">
        Regards,<br/>
        The Platform Team
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 24px;background:#f8fafc;border-top:1px solid #eef0f2;text-align:center;font-size:12px;color:#9aa4b2;">
          This email was sent to ${user.email}. If you did not request this, please ignore it.
        </td>
      </tr>
        </table>
      </body>
        </html>`,
      });
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new AuthService();
