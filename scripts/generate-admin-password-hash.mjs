import bcrypt from "bcryptjs";

const password = process.argv[2] ?? process.env.ADMIN_PASSWORD_PLAIN;

if (!password) {
  console.error(
    'Usage: npm run admin:hash -- "your-admin-password"\n' +
      "Or set ADMIN_PASSWORD_PLAIN and run: npm run admin:hash",
  );
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const dotenvHash = hash.replaceAll("$", "\\$");

console.log("Use this value in hosting environment variable dashboards:");
console.log(hash);
console.log("");
console.log("Use this value in .env files:");
console.log(dotenvHash);
