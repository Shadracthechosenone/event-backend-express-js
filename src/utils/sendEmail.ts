import nodemailer from "nodemailer";

interface EmailAttachment {
  filename: string;
  content: Buffer;
  cid?: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
}

interface TransporterConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
}

const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments,
}: EmailOptions): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    } as TransporterConfig);

    const mailOptions: MailOptions = {
      from: "Dev Team <", // <- à corriger, voir plus bas
      to,
      subject,
      text,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default sendEmail;