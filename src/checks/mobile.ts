export function checkMobileFriendly(): boolean {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return false;

  const content = viewport.getAttribute("content");
  if (!content) return false;

  return content.includes("width=device-width") && content.includes("initial-scale=1");
}
