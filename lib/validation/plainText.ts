export const htmlInputError = "HTML-теги в полях недопустимы.";

export function hasHtmlInput(value: string) {
  return /[<>]/.test(value);
}

export function isPlainTextInput(value: string) {
  return !hasHtmlInput(value);
}
