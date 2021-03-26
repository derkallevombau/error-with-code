export interface ErrorOptions {
    /**
     * The code to be used for all invocations of `error(message: string)`.
     */
    code?: string;
    /**
     * A string to be prepended to the message supplied
     * to `error(message: string)` and `error(message: string, code: string)`.
     */
    messagePrefix?: string;
}
/**
 * Sets options for `error(message: string)` and `error(message: string, code: string)`.\
 * @param options -
 */
export default function error(options: ErrorOptions): void;
/**
 * Throws an `Error` object constructed
 * with `message` and `code` property set to provided code.
 * @param message - Error message
 * @param code - Error code
 */
export default function error(message: string, code: string): void;
/**
 * Throws an `Error` object constructed
 * with `message` and `code` property set to code
 * defined via `error({ code: <code> })`.
 * @param message - Error message
 */
export default function error(message: string): void;
//# sourceMappingURL=error-with-code.d.ts.map