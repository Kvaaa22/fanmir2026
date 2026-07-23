import { z } from "zod";
import { sendFormEmail, SmtpConfigError } from "@/lib/mail/sendFormEmail";
import { escapeHtml } from "@/lib/mail/escapeHtml";
import { checkRateLimit } from "@/lib/security/rateLimit";
import {
  getCatalogPriceCards,
  type CatalogPriceCard,
} from "@/lib/catalog/getCatalogData";
import {
  htmlInputError,
  isPlainTextInput,
} from "@/lib/validation/plainText";

export const runtime = "nodejs";

const orderItemSchema = z.object({
  id: z.string().min(1).max(120).refine(isPlainTextInput, {
    message: htmlInputError,
  }),
  quantity: z.number().int().positive().max(999),
});

const orderRequestSchema = z.object({
  customer: z.object({
    email: z.string().trim().email().max(160).refine(isPlainTextInput, {
      message: htmlInputError,
    }),
    name: z.string().trim().min(1).max(80).refine(isPlainTextInput, {
      message: htmlInputError,
    }),
    phone: z.string().trim().min(1).max(40).refine(isPlainTextInput, {
      message: htmlInputError,
    }),
  }),
  items: z.array(orderItemSchema).min(1).max(50),
});

type OrderPayload = z.infer<typeof orderRequestSchema>;

type VerifiedOrderItem = Pick<
  CatalogPriceCard,
  "id" | "meta" | "price" | "pricePerM2" | "unitPriceRub"
> & {
  quantity: number;
  title: string;
};

type VerifiedOrder = {
  customer: OrderPayload["customer"];
  items: VerifiedOrderItem[];
  totalPrice: number;
};

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function formatRub(value: number) {
  return `${rubFormatter.format(value)} руб.`;
}

function formatLineTotal(item: VerifiedOrderItem) {
  return item.unitPriceRub == null ? "Сумма не рассчитана" : formatRub(item.unitPriceRub * item.quantity);
}

function createTextMessage(order: VerifiedOrder) {
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

function createHtmlMessage(order: VerifiedOrder) {
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

async function verifyOrder(payload: OrderPayload): Promise<VerifiedOrder | null> {
  const catalogItems = await getCatalogPriceCards();
  const catalogItemsById = new Map(catalogItems.map((item) => [item.id, item]));
  const uniqueIds = new Set<string>();
  const items: VerifiedOrderItem[] = [];

  for (const requestedItem of payload.items) {
    if (uniqueIds.has(requestedItem.id)) {
      return null;
    }

    const catalogItem = catalogItemsById.get(requestedItem.id);

    if (!catalogItem) {
      return null;
    }

    uniqueIds.add(requestedItem.id);
    items.push({
      id: catalogItem.id,
      meta: catalogItem.meta,
      price: catalogItem.price,
      pricePerM2: catalogItem.pricePerM2,
      quantity: requestedItem.quantity,
      title: [catalogItem.titleLineOne, catalogItem.titleLineTwo]
        .filter(Boolean)
        .join(" "),
      unitPriceRub: catalogItem.unitPriceRub,
    });
  }

  return {
    customer: payload.customer,
    items,
    totalPrice: items.reduce(
      (total, item) =>
        total + (item.unitPriceRub == null ? 0 : item.unitPriceRub * item.quantity),
      0,
    ),
  };
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
    const order = await verifyOrder(parsedPayload.data);

    if (!order) {
      return Response.json(
        {
          message:
            "Состав корзины или цены изменились. Обновите страницу и попробуйте еще раз.",
          ok: false,
        },
        { status: 400 },
      );
    }

    await sendFormEmail({
      html: createHtmlMessage(order),
      replyTo: order.customer.email,
      subject: `Новый заказ с сайта: ${order.customer.name}`,
      text: createTextMessage(order),
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
        message: "Не удалось обработать заказ. Попробуйте еще раз.",
        ok: false,
      },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
