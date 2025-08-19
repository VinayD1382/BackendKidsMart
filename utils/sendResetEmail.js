import nodemailer from "nodemailer";

export const sendResetEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Kids Mart Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Admin Password Reset",
    html: `<p>Click the link to reset your password:</p><a href="${link}">${link}</a>`,
  });
};
