import { z } from "zod";
import { sendFormEmail, SmtpConfigError } from "@/lib/mail/sendFormEmail";
import { checkRateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const orderItemSchema = z.object({
  id: z.string().min(1),
  meta: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  price: z.string(),
  pricePerM2: z.string().optional(),
  quantity: z.number().int().positive(),
  title: z.string().min(1),
  unitPriceRub: z.number().nullable(),
});

const orderRequestSchema = z.object({
  customer: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    phone: z.string().min(1),
  }),
  items: z.array(orderItemSchema).min(1),
  totalPrice: z.number().nonnegative(),
});

type OrderRequest = z.infer<typeof orderRequestSchema>;

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatRub(value: number) {
  return `${rubFormatter.format(value)} руб.`;
}

function formatLineTotal(item: OrderRequest["items"][number]) {
  return item.unitPriceRub == null ? "Сумма не рассчитана" : formatRub(item.unitPriceRub * item.quantity);
}

function createTextMessage(order: OrderRequest) {
  const lines = [
    "Новый заказ с сайта Фанерный мир",
    "",
    `Имя: ${order.customer.name}`,
    `Телефон: ${order.customer.phone}`,
    `E-mail: ${order.customer.email}`,
    "",
    "Состав заказа:",
    ...order.items.flatMap((item, index) => [
      `${index + 1}. ${item.title}`,
      `   Количество: ${item.quantity}`,
      `   Цена на сайте: ${item.price}`,
      item.pricePerM2 ? `   Цена за м²: ${item.pricePerM2}` : "",
      `   Сумма позиции: ${formatLineTotal(item)}`,
      ...item.meta.map((metaItem) => `   ${metaItem.label}: ${metaItem.value}`),
      "",
    ]),
    `Итого: ${formatRub(order.totalPrice)}`,
  ];

  return lines.filter((line) => line !== "").join("\n");
}

function createHtmlMessage(order: OrderRequest) {
  const itemsMarkup = order.items
    .map((item, index) => {
      const metaMarkup = item.meta
        .map(
          (metaItem) =>
            `<li><strong>${escapeHtml(metaItem.label)}:</strong> ${escapeHtml(metaItem.value)}</li>`,
        )
        .join("");

      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eeeeee;vertical-align:top;">${index + 1}</td>
          <td style="padding:12px;border-bottom:1px solid #eeeeee;vertical-align:top;">
            <strong>${escapeHtml(item.title)}</strong>
            <ul style="margin:8px 0 0;padding-left:18px;">${metaMarkup}</ul>
            ${item.pricePerM2 ? `<p style="margin:8px 0 0;"><strong>Цена за м²:</strong> ${escapeHtml(item.pricePerM2)}</p>` : ""}
          </td>
          <td style="padding:12px;border-bottom:1px solid #eeeeee;vertical-align:top;">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #eeeeee;vertical-align:top;">${escapeHtml(item.price)}</td>
          <td style="padding:12px;border-bottom:1px solid #eeeeee;vertical-align:top;">${escapeHtml(formatLineTotal(item))}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#2f2f2f;">
      <h1 style="font-size:22px;margin:0 0 16px;">Новый заказ с сайта Фанерный мир</h1>
      <p><strong>Имя:</strong> ${escapeHtml(order.customer.name)}</p>
      <p><strong>Телефон:</strong> ${escapeHtml(order.customer.phone)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(order.customer.email)}</p>
      <h2 style="font-size:18px;margin:24px 0 12px;">Состав заказа</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:12px;text-align:left;border-bottom:2px solid #dddddd;">#</th>
            <th style="padding:12px;text-align:left;border-bottom:2px solid #dddddd;">Товар</th>
            <th style="padding:12px;text-align:left;border-bottom:2px solid #dddddd;">Кол-во</th>
            <th style="padding:12px;text-align:left;border-bottom:2px solid #dddddd;">Цена на сайте</th>
            <th style="padding:12px;text-align:left;border-bottom:2px solid #dddddd;">Сумма</th>
          </tr>
        </thead>
        <tbody>${itemsMarkup}</tbody>
      </table>
      <p style="font-size:18px;margin-top:18px;"><strong>Итого:</strong> ${formatRub(order.totalPrice)}</p>
    </div>
  `;
}

export async function POST(request: Request) {
  if (!checkRateLimit(request, "order-request", { limit: 5, windowMs: 60_000 })) {
    return Response.json(
      { message: "Слишком много заявок. Попробуйте чуть позже.", ok: false },
      { status: 429 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsedPayload = orderRequestSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return Response.json(
      { message: "Проверьте данные заказа и попробуйте еще раз.", ok: false },
      { status: 400 },
    );
  }

  try {
    await sendFormEmail({
      html: createHtmlMessage(parsedPayload.data),
      replyTo: parsedPayload.data.customer.email,
      subject: `Новый заказ с сайта: ${parsedPayload.data.customer.name}`,
      text: createTextMessage(parsedPayload.data),
    });
  } catch (error) {
    if (error instanceof SmtpConfigError) {
      console.error("[mail] Order request was not sent: SMTP_USER and SMTP_PASSWORD are not configured.");

      return Response.json(
        {
          message:
            "Отправка почты не настроена. Добавьте SMTP_USER и SMTP_PASSWORD в переменные окружения.",
          ok: false,
        },
        { status: 500 },
      );
    }

    console.error("[mail] Order request was not sent:", error);

    return Response.json(
      {
        message: "Не удалось отправить письмо. Проверьте SMTP-настройки и попробуйте еще раз.",
        ok: false,
      },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
