import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Load and compile email template
async function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, `../templates/emails/${templateName}.hbs`);
  const template = await fs.readFile(templatePath, 'utf-8');
  return compile(template);
}

// Send email
export async function sendEmail({ to, subject, template, context }) {
  try {
    // Load and compile template
    const compiledTemplate = await loadTemplate(template);
    const html = compiledTemplate(context);

    // Send email
    const info = await transporter.sendMail({
      from: `"Keys'n'Caps" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 