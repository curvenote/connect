export function isLocalHost(origin: string) {
  try {
    const url = new URL(origin);
    if (url.hostname === "localhost") {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
}
