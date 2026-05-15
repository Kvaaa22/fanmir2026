# Fanmir

Next.js application for the Fanmir site and admin price import workflow.

## Release checklist

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create environment variables from `.env.example`.

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
- `ADMIN_LOGIN`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_JWT_SECRET`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `FORM_RECIPIENT_EMAIL` or `MAIL_TO`
- `NEXT_PUBLIC_YANDEX_MAPS_API_KEY`

Uploaded price files are stored under `storage/`. Keep that directory on
persistent disk in production if the host filesystem is ephemeral.
