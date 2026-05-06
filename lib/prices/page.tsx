import prisma from "@/lib/prisma";

export default async function AdminPricesPage() {
  const imports = await prisma.priceImport.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return (
    <main style={{ padding: "120px 40px" }}>
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
          <input
            type="file"
            name="priceFile"
            accept=".xlsx"
            required
          />
        </label>

        <button type="submit">
          Загрузить и обновить цены
        </button>
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
                <th>Тип</th>
                <th>Файл</th>
                <th>Строк</th>
                <th>Статус</th>
                <th>Картинка</th>
              </tr>
            </thead>

            <tbody>
              {imports.map((item) => (
                <tr key={item.id}>
                  <td>{item.createdAt.toLocaleString("ru-RU")}</td>
                  <td>{item.source}</td>
                  <td>{item.originalFileName}</td>
                  <td>{item.rowsCount}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.imagePath ? (
                      <a href={`/api/price-image/latest?source=${item.source}`}>
                        открыть
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}