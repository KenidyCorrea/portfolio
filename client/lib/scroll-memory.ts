/** Scroll positions per history entry, used to restore position on back/forward. */
const positions = new Map<string, number>();

export function rememberScroll(key: string, y: number = window.scrollY): void {
  positions.set(key, y);
}

export function recallScroll(key: string): number | undefined {
  return positions.get(key);
}
