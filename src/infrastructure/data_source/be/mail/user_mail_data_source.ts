import nodemailer from "nodemailer";

export namespace UserMailDataSource {
  export async function sendMail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Tambahkan ini untuk pastikan `servername` tidak diset ke IP
        servername: process.env.SMTP_HOST,
      },
    });

    await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }
}
