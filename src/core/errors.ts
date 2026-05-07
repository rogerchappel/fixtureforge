export class FixtureForgeError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'FixtureForgeError';
    this.code = code;
  }
}

export function asErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
