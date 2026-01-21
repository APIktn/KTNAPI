import nodemailer from "nodemailer";

export const sendVerifyEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const link = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"KTN API" <no-reply@ktn.com>',
    to,
    subject: "ยืนยันอีเมล",
    html: `<a href="${link}">ยืนยันอีเมล</a>`
  });
};
