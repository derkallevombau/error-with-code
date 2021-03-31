/*
* error-with-code.ts
* Author: derkallevombau
* Created: Mar 25, 2021
*/

/* eslint-disable tsdoc/syntax */

import { getCallerFileName, getCallerTypeName, getCallerFunctionName } from './get-caller';
export interface ErrorWithCode extends Error
{
	code?: string;
	OptsFromCaller: Map<string, ErrorOptions>;
}

export interface ErrorOptions
{
	/**
	 * The code to be used for all invocations of `error(message: string)`.
	 */
	code?: string;

	/**
	 * A string to be prepended to the message supplied
	 * to `error(message: string)` and `error(message: string, code: string)`.
	 */
	messagePrefix?: string;

	/**
	 * The scope for the options.\
	 * Depending on your choice, your options will only affect invocations of
	 * `error(message: string)` and `error(message: string, code: string)`
	 * from within the same file, class or function where you called
	 * `error(options: ErrorOptions)`.
	 */
	scope: 'file' | 'class' | 'function';
}

// Since functions are objects, we can use properties
// as a replacement for "static variables", i. e. variables
// that keep their values between invocations.
// But since each caller in a process uses the same object, we have to use a map
// to store the options specified via overload 1 individually for each caller,
// using the caller of kind specified via options.scope as key.
// Of course it would be easier to code by making the error function a member of a class,
// but this way, its easier to use: You just call the function, without the need to
// instantiate a class and assign it to a variable.
// We could just assign the map to 'this.OptsFromCaller' inside the function body, but then
// we would have to check if the map has been assigned on each invocation.
// By using 'Object.defineProperty', we can make the property read-only and provide
// an initial value.
// N. B.: For functions: When using 'this', the props can only be accessed from inside
//                       the function body, as opposed to using the function name.
//                       When using 'Object.defineProperty', we have to use the function
//                       name, even inside the function bpdy.
Object.defineProperty(error, 'OptsFromCaller', { writable: false, enumerable: false, configurable: false, value: new Map<string, ErrorOptions>() });

/**
 * Sets options for `error(message: string)` and `error(message: string, code: string)`.
 * @param options - Allows you to specify an error code, a message prefix
 * and their scope.
 */
export function error(options: ErrorOptions): void;

/**
 * Throws an `Error` with `message` (prefixed with string defined
 * via `error({ messagePrefix: string })`, if any)
 * and `code` property set to provided code.
 * @param message - Error message
 * @param code - Error code
 */
export function error(message: string, code: string): void;

/**
 * Throws an `Error` with `message` (prefixed with string defined
 * via `error({ messagePrefix: string })`, if any)
 * and `code` property set to code defined via `error({ code: string })`,
 * if any.
 * @param message - Error message
 */
export function error(message: string): void;

export function error(...args: (ErrorOptions | string)[]): void
{
	// Helper functions

	function getMap()
	{
		return (error as unknown as ErrorWithCode).OptsFromCaller;
	}

	type Scopes = 'file' | 'class' | 'function';

	function getCallerFromScope(scope: Scopes, goBackBy: number)
	{
		switch (scope)
		{
			case 'file': return getCallerFileName(goBackBy);
			case 'class': return getCallerTypeName(goBackBy);
			case 'function': return getCallerFunctionName(goBackBy);
		}
	}
	function getOptions()
	{
		// To get the options object, we need the scope to know which kind of caller
		// was used to store the options, but the scope is stored in the options object.
		// Thus, for each scope, we obtain the according kind of caller and check if we
		// have that caller in our map and if the scope stored in the according options
		// object equals the scope we are testing.

		for (const possibleScope of ['file', 'class', 'function'])
		{
			const possibleOriginalCaller = getCallerFromScope(possibleScope as Scopes, 3);
			const map = getMap();

			if (map.has(possibleOriginalCaller))
			{
				const possibleOpts = map.get(possibleOriginalCaller);

				if (possibleOpts.scope === possibleScope) return possibleOpts;
			}
		}
	}

	function throwError(message: string, code?: string)
	{
		const options = getOptions();

		if (options.messagePrefix) message = options.messagePrefix + ' ' + message;

		const e = new Error(message) as ErrorWithCode;

		if (code) e.code = code; // This must be checked first because a code provided via overload 2 takes precedence over a code set via overload 1, if any.
		else if (options.code) e.code = options.code;

		throw e;
	}

	switch (args.length)
	{
		case 1: // Overload 1 or 3
			if (typeof args[0] === 'string') // Overload 3
			{
				// Cool: Type guards work with expressions like 'args[0]' too,
				// i. e. message has type string.
				const message = args[0];

                throwError(message);
			}
			else // Overload 1
			{
				// Very cool: TS knows that 'args[0]' has type ErrorOptions here.
				const options = args[0];

                getMap().set(getCallerFromScope(options.scope, 1), options);
			}

			break;
		case 2: // Overload 2
			{
                const message = args[0] as string;
                const code = args[1] as string;

				throwError(message, code);
			}
	}
}
