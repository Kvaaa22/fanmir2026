import nodemailer from "nodemailer";

type SendFormEmailParams = {
  html: string;
  replyTo?: string;
  subject: string;
  text: string;
};

export class SmtpConfigError extends Error {
  constructor() {
    super("SMTP is not configured");
    this.name = "SmtpConfigError";
  }
}

function getSmtpConfig() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  const userDomain = user.split("@").at(1)?.toLowerCase();
  const inferredHost =
    userDomain == null
      ? "smtp.yandex.ru"
      : ["yandex.ru", "ya.ru", "yandex.com"].includes(userDomain)
        ? "smtp.yandex.ru"
        : ["mail.ru", "inbox.ru", "list.ru", "bk.ru", "internet.ru"].includes(userDomain)
          ? "smtp.mail.ru"
          : userDomain === "gmail.com"
            ? "smtp.gmail.com"
            : "smtp.yandex.ru";

  return {
    from: process.env.SMTP_FROM ?? user,
    host: process.env.SMTP_HOST ?? inferredHost,
    pass,
    port,
    secure:
      process.env.SMTP_SECURE == null
        ? port === 465
        : process.env.SMTP_SECURE === "true",
    user,
  };
}

export async function sendFormEmail({
  html,
  replyTo,
  subject,
  text,
}: SendFormEmailParams) {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    throw new SmtpConfigError();
  }

  const transporter = nodemailer.createTransport({
    auth: {
      pass: smtpConfig.pass,
      user: smtpConfig.user,
    },
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
  });

  await transporter.sendMail({
    from: smtpConfig.from,
    html,
    replyTo,
    subject,
    text,
    to: process.env.FORM_RECIPIENT_EMAIL ?? process.env.MAIL_TO ?? "kvaaa5a@gmail.com",
  });
}
