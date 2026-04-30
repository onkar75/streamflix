export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void | Promise<void>,
  delay = 300,
) {
  let timer: number | undefined;

  return (...args: Args): Promise<void> => {
    if (timer) {
      clearTimeout(timer);
    }

    return new Promise((resolve) => {
      timer = window.setTimeout(async () => {
        await fn(...args);
        resolve();
      }, delay);
    });
  };
}
