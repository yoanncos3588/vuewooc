export function stripHTMLFromString(text: string): string {
  const regexForStripHTML = /<([^</> ]+)[^<>]*?>[^<>]*?<\/\1> */gi;
  return text.replace(regexForStripHTML, "");
}
