import prisma from "@/lib/prisma";

const PRICE_SOURCE_LABELS: Record<string, string> = {
  MAIN: "Основной прайс",
  PLYDEX: "Plydex",
};

const IMPORT_STATUS_LABELS: Record<string, string> = {
  success: "Успешно",
  error: "Ошибка",
};

function getSourceLabel(source: string) {
  return PRICE_SOURCE_LABELS[source] ?? source;
}

function getStatusLabel(status: string) {
  return IMPORT_STATUS_LABELS[status] ?? status;
}

function getStoredFileName(filePath: string | null, fallbackName: string) {
  if (!filePath) {
    return fallbackName;
  }

  const baseName = filePath.split(/[\\/]/).pop() ?? fallbackName;
  const cleanName = baseName.replace(/^\d+-(main|plydex)-/i, "");

  return cleanName || fallbackName;
}

function getFileHref(
  importId: number,
  type: "excel" | "pdf",
  download = false
) {
  const params = new URLSearchParams({
    id: importId.toString(),
    type,
  });

  if (download) {
    params.set("download", "1");
  }

  return `/api/price-import-file?${params.toString()}`;
}

const fileActionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 4,
} as const;

export default async function AdminPricesPage() {
  const imports = await prisma.priceImport.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return (
    <main style={{ padding: "120px 40px" }}>
 <div className={`container`}>
      <h1>Обновление цен</h1>

      <form
        action="/admin/prices/upload"
        method="post"
        encType="multipart/form-data"
        style={{
          display: "grid",
          gap: 16,
          maxWidth: 520,
        }}
      >
        <label>
          Тип прайса
          <br />
          <select name="source" required defaultValue="MAIN">
            <option value="MAIN">Основной прайс</option>
            <option value="PLYDEX">Plydex</option>
          </select>
        </label>

        <label>
          Excel-файл
          <br />
          <input type="file" name="priceFile" accept=".xlsx" required />
        </label>

        <label>
          PDF-файл
          <br />
          <input type="file" name="pricePdf" accept=".pdf" required />
        </label>

        <button type="submit">Загрузить и обновить цены</button>
      </form>

      <section style={{ marginTop: 40 }}>
        <h2>Последние загрузки</h2>

        {imports.length === 0 ? (
          <p>Загрузок пока нет.</p>
        ) : (
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Тип прайса</th>
                <th>Excel-файл</th>
                <th>PDF-файл</th>
                <th>Позиции</th>
                <th>Статус</th>
              </tr>
            </thead>

            <tbody>
              {imports.map((item) => (
                <tr key={item.id}>
                  <td>{item.createdAt.toLocaleString("ru-RU")}</td>
                  <td>{getSourceLabel(item.source)}</td>
                  <td>
                    {item.storedFilePath ? (
                      <>
                        <div>{item.originalFileName}</div>
                        <div style={fileActionsStyle}>
                          <a href={getFileHref(item.id, "excel", true)}>
                            Скачать XLSX
                          </a>
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {item.pdfPath ? (
                      <>
                        <div>{getStoredFileName(item.pdfPath, "price.pdf")}</div>
                        <div style={fileActionsStyle}>
                          <a
                            href={getFileHref(item.id, "pdf")}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Открыть
                          </a>
                          <a href={getFileHref(item.id, "pdf", true)}>
                            Скачать PDF
                          </a>
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{item.rowsCount.toLocaleString("ru-RU")}</td>
                  <td>{getStatusLabel(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
    </main>
  );
}
