import { z } from "zod";
import { sendFormEmail, SmtpConfigError } from "@/lib/mail/sendFormEmail";
import { escapeHtml } from "@/lib/mail/escapeHtml";
import { checkRateLimit } from "@/lib/security/rateLimit";
import {
  htmlInputError,
  isPlainTextInput,
} from "@/lib/validation/plainText";

export const runtime = "nodejs";

const callbackRequestSchema = z.object({
  name: z.string().trim().min(1).max(80).refine(isPlainTextInput, {
    message: htmlInputError,
  }),
  phone: z.string().trim().min(1).max(40).refine(isPlainTextInput, {
    message: htmlInputError,
  }),
});

type CallbackRequest = z.infer<typeof callbackRequestSchema>;

function createTextMessage(callbackRequest: CallbackRequest) {
  return [
    "Новый заказ звонка с сайта Фанерный мир",
    "",
    `Имя: ${callbackRequest.name}`,
    `Телефон: ${callbackRequest.phone}`,
  ].join("\n");
}

function createHtmlMessage(callbackRequest: CallbackRequest) {
  return `
    <div style="font-family:Arial,sans-serif;color:#2f2f2f;">
      <h1 style="font-size:22px;margin:0 0 16px;">Новый заказ звонка с сайта Фанерный мир</h1>
      <p><strong>Имя:</strong> ${escapeHtml(callbackRequest.name)}</p>
      <p><strong>Телефон:</strong> ${escapeHtml(callbackRequest.phone)}</p>
    </div>
  `;
}

export async function POST(request: Request) {
  if (!checkRateLimit(request, "callback-request", { limit: 5, windowMs: 60_000 })) {
    return Response.json(
      { message: "Слишком много заявок. Попробуйте чуть позже.", ok: false },
      { status: 429 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsedPayload = callbackRequestSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return Response.json(
      { message: "Проверьте имя и телефон, затем попробуйте еще раз.", ok: false },
      { status: 400 },
    );
  }

  try {
    await sendFormEmail({
      html: createHtmlMessage(parsedPayload.data),
      subject: `Заказ звонка с сайта: ${parsedPayload.data.name}`,
      text: createTextMessage(parsedPayload.data),
    });
  } catch (error) {
    if (error instanceof SmtpConfigError) {
      console.error("[mail] Callback request was not sent: SMTP_USER and SMTP_PASSWORD are not configured.");

      return Response.json(
        {
          message:
            "Отправка почты не настроена. Добавьте SMTP_USER и SMTP_PASSWORD в переменные окружения.",
          ok: false,
        },
        { status: 500 },
      );
    }

    console.error("[mail] Callback request was not sent:", error);

    return Response.json(
      {
        message: "Не удалось отправить заявку. Проверьте SMTP-настройки и попробуйте еще раз.",
        ok: false,
      },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
