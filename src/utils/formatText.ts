export function stripHTMLFromString(text: string): string {
  return text.replace(/(<([^>]+)>)/gi, "");
}
