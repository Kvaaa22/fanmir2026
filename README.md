# Fanmir

Next.js application for the Fanmir site and admin price import workflow.

## Release checklist

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create environment variables from `.env.example`.

   For the admin password, generate a bcrypt hash:

   ```bash
   npm run admin:hash -- "your-admin-password"
   ```

   Use the raw hash in hosting environment variable dashboards. If you put the
   hash into a `.env` file, use the escaped version printed by the command
   because Next.js expands `$VARIABLE` references inside `.env*` files.

3. Apply Prisma migrations on the target database:

   ```bash
   npm run prisma:deploy
   ```

4. Build and start:

   ```bash
   npm run build
   npm run start
   ```

## Required environment variables

- `DATABASE_URL`
- `STORAGE_ROOT` (persistent directory for uploaded price files)
- `SITE_URL` (public HTTPS origin, for example `https://example.com`)
- `ADMIN_LOGIN`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_JWT_SECRET`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `FORM_RECIPIENT_EMAIL` or `MAIL_TO`
- `NEXT_PUBLIC_YANDEX_MAPS_API_KEY`

Uploaded price files are stored under `STORAGE_ROOT` (or `storage/` when the
variable is omitted). Keep that directory on persistent disk in production if
the host filesystem is ephemeral.

`RATE_LIMIT_IP_HEADER` is optional. Set it only when the application runs
behind a trusted reverse proxy that overwrites the selected header; otherwise
all requests share one conservative rate-limit bucket.
