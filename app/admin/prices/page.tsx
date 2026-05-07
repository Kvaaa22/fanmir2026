import prisma from "@/lib/prisma";
import styles from "./page.module.css";

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

export default async function AdminPricesPage() {
  const imports = await prisma.priceImport.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    select: {
      id: true,
      source: true,
      originalFileName: true,
      storedFilePath: true,
      pdfPath: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Обновление цен</h1>
        </header>

        <form
          action="/admin/prices/upload"
          method="post"
          encType="multipart/form-data"
          className={styles.form}
        >
          <label className={styles.field}>
            <span className={styles.label}>Тип прайса</span>
            <select className={styles.control} name="source" required defaultValue="MAIN">
              <option value="MAIN">Основной прайс</option>
              <option value="PLYDEX">Plydex</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Excel-файл</span>
            <input
              className={styles.control}
              type="file"
              name="priceFile"
              accept=".xlsx"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>PDF-файл</span>
            <input
              className={styles.control}
              type="file"
              name="pricePdf"
              accept=".pdf"
              required
            />
          </label>

          <button className={styles.submitButton} type="submit">
            Загрузить и обновить цены
          </button>
        </form>

        <section className={styles.importsSection}>
          <h2 className={styles.sectionTitle}>Последние загрузки</h2>

          {imports.length === 0 ? (
            <p className={styles.empty}>Загрузок пока нет.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Тип прайса</th>
                    <th>Excel-файл</th>
                    <th>PDF-файл</th>
                    <th>Статус</th>
                  </tr>
                </thead>

                <tbody>
                  {imports.map((item) => (
                    <tr key={item.id}>
                      <td data-label="Дата">
                        {item.createdAt.toLocaleString("ru-RU")}
                      </td>
                      <td data-label="Тип прайса">
                        {getSourceLabel(item.source)}
                      </td>
                      <td data-label="Excel-файл">
                        {item.storedFilePath ? (
                          <>
                            <div className={styles.fileName}>
                              {item.originalFileName}
                            </div>
                            <div className={styles.fileActions}>
                              <a
                                className={styles.actionLink}
                                href={getFileHref(item.id, "excel", true)}
                              >
                                Скачать XLSX
                              </a>
                            </div>
                          </>
                        ) : (
                          <span className={styles.missingFile}>-</span>
                        )}
                      </td>
                      <td data-label="PDF-файл">
                        {item.pdfPath ? (
                          <>
                            <div className={styles.fileName}>
                              {getStoredFileName(item.pdfPath, "price.pdf")}
                            </div>
                            <div className={styles.fileActions}>
                              <a
                                className={styles.actionLink}
                                href={getFileHref(item.id, "pdf")}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Открыть
                              </a>
                              <a
                                className={styles.actionLink}
                                href={getFileHref(item.id, "pdf", true)}
                              >
                                Скачать PDF
                              </a>
                            </div>
                          </>
                        ) : (
                          <span className={styles.missingFile}>-</span>
                        )}
                      </td>
                      <td data-label="Статус">
                        <span className={styles.status}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
