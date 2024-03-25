import nodemailer from 'nodemailer';

const {
  auth: { userMail, passwordMail },
} = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  // Example using Gmail
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: userMail,
    pass: passwordMail, // Consider using environment variables to secure this
  },
});

export async function sendEmail({ to, subject, text, html }: any) {
  const mailOptions = {
    from: 'nguyenvietthoit@gmail.com',
    to,
    subject,
    text,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
