const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

/** Public browser-to-Express API origin. Never put server secrets in this module. */
export const apiUrl = (configuredApiUrl || "http://localhost:5000").replace(/\/$/, "");
