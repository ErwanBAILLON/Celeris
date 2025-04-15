import nodemailer from 'nodemailer';
import { resetPasswordTemplate } from './template/resetPassword';
import { registerTemplate } from './template/login';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export class Mailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.validateEnvVariables();
    this.transporter = this.createTransporter();
  }

  private validateEnvVariables(): void {
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'];
    const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

    if (missingVars.length > 0) {
      throw new Error(
        `The following environment variables are missing: ${missingVars.join(', ')}. ` +
        'Please ensure they are defined before starting the application.'
      );
    }
  }

  private createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST, 
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD?.replace('!', '#'),
        },
        tls: {
          rejectUnauthorized: false
        }
      });
  }

  public async sendMail(options: MailOptions): Promise<void> {
    const { to, subject, html } = options;

    if (!to || !subject || !html) {
      throw new Error("The fields 'to', 'subject', and 'html' are required to send an email.");
    }

    const mailOptions = {
      from: 'info@sorago.fr',
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to} (ID: ${info.messageId})`);
    } catch (error) {
      console.error('Error while sending the email:', error);
      throw new Error("An error occurred while sending the email.");
    }
    await this.transporter.close();
  }

  public async sendResetPasswordEmail(to: string, name: string, token: string): Promise<void> {
    const subject = 'Password Reset';
    const html = resetPasswordTemplate(name, token);
    await this.sendMail({ to, subject, html });
  }

  public async sendLoginEmail(to: string, name: string): Promise<void> {
    const subject = 'Login to Your Account';
    const html = registerTemplate(name);
    await this.sendMail({ to, subject, html });
  }
}