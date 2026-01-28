/**
 * Generic debounce function that delays execution until after a specified wait period
 * has elapsed since the last time it was invoked.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Debounce function with immediate execution option
 * Useful when you want the first call to execute immediately
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounceImmediate<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Execute immediately if enough time has passed
    if (timeSinceLastCall >= delay) {
      fn.apply(this, args);
      lastCallTime = now;
    } else {
      // Otherwise, schedule for later
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
        lastCallTime = Date.now();
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
}
