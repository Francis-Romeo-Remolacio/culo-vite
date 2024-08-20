// Formatter.ts

/**
 * Converts a number to a currency string.
 * @param {number} value - The number to format as currency.
 * @param {string} [locale=en-US] - The locale string to use for formatting.
 * @param {string} [currency=USD] - The currency string to use for formatting.
 * @returns {string} - The formatted currency string.
 */
export function toCurrency(
  value: number,
  locale: string = "en-PH",
  currency: string = "PHP"
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value
  );
}

/**
 * Converts a string to kebab-case.
 * @param {string} str - The string to convert to kebab-case.
 * @returns {string} - The kebab-case formatted string.
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[A-Z]/g, (match) => "-" + match.toLowerCase()) // Add hyphen before uppercase letters and convert them to lowercase
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens
}
