/**
 * Helper to convert unknown catch errors into Record<string, any> for logger.
 */

export function errorMeta(err: unknown): Record<string, any> | undefined {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  if (typeof err === 'object' && err !== null) {
    return { err } as Record<string, any>;
  }
  return { err: String(err) };
}
