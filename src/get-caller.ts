/*
* get-caller.ts
* Author: derkallevombau
* Created: Mar 28, 2021
*/

/* eslint-disable tsdoc/syntax */

function getCallStack(): NodeJS.CallSite[]
{
	const prepareStackTraceOrg = Error.prepareStackTrace;
	const err = new Error();

	Error.prepareStackTrace = (_, stack) => { return stack; };

	// err.stack's declared type is string, no idea why...
	const stack = err.stack as unknown as NodeJS.CallSite[];

	Error.prepareStackTrace = prepareStackTraceOrg;

	return stack;
}

function getCallerCallSite(Index: number): NodeJS.CallSite
{
	return getCallStack()[Index];
}

// 0: getCallStack
// 1: getCallerCallSite
// 2: getCallerXXXName
// 3: caller of getCallerXXXName
// 4: caller of caller of getCallerXXXName => This is what you normally want.
/**
 * @param goBackBy - Omit this if you call this function
 * directly from the function you want to get the caller of.\
 * But if you call this function via a helper function,
 * you must provide a value of 1 to get the right caller.\
 * Generally speaking, the value must be the number of
 * "concatenated" helper functions you use.
 * @returns The file name of the caller.
 * @ignore
 */
export function getCallerFileName(goBackBy?: number): string
{
	let i = 4;

	if (goBackBy) i += goBackBy;

	return getCallerCallSite(i).getFileName();
}

/**
 * @param goBackBy - Omit this if you call this function
 * directly from the function you want to get the caller of.\
 * But if you call this function via a helper function,
 * you must provide a value of 1 to get the right caller.\
 * Generally speaking, the value must be the number of
 * "concatenated" helper functions you use.
 * @returns The function name of the caller.
 * @ignore
 */
 export function getCallerFunctionName(goBackBy?: number): string
{
	let i = 4;

	if (goBackBy) i += goBackBy;

	return getCallerCallSite(i).getFunctionName();
}

/**
 * @param goBackBy - Omit this if you call this function
 * directly from the function you want to get the caller of.\
 * But if you call this function via a helper function,
 * you must provide a value of 1 to get the right caller.\
 * Generally speaking, the value must be the number of
 * "concatenated" helper functions you use.
 * @returns The type (class) name of the caller.
 * @ignore
 */
 export function getCallerTypeName(goBackBy?: number): string
{
	let i = 4;

	if (goBackBy) i += goBackBy;

	return getCallerCallSite(i).getTypeName();
}

// 0: getCallStack
// 1: printStackTrace
// 2: caller of printStackTrace
/**
 * @param goBackBy - By default, the caller of this function is included.
 * To exclude it, provide a value of -1.
 */
export function printStackTrace(goBackBy?: number): void
{
	let i = 2;

	if (goBackBy) i += goBackBy;

	const stack = getCallStack().slice(i);

	i = 0;

	while (stack.length)
	{
		const callSite = stack.shift();

		console.log(`${i++}:`);
		console.log('this:', callSite.getThis());
		console.log('typeName:', callSite.getTypeName());
		console.log('function:', callSite.getFunction());
		console.log('functionName:', callSite.getFunctionName());
		console.log('methodName:', callSite.getMethodName());
		console.log('fileName <line:col>:', `${callSite.getFileName()} ${callSite.getLineNumber()}:${callSite.getColumnNumber()}`);
		console.log('isEval:', callSite.isEval());
		console.log('evalOrigin:', callSite.getEvalOrigin());
		console.log('isTopLevel:', callSite.isToplevel());
		console.log('isNative:', callSite.isNative());
		console.log('isConstructor:', callSite.isConstructor(), '\n');
	}
}
