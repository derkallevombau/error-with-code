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

function getCallerCallSite(): NodeJS.CallSite
{
	return getCallStack()[2];
}

/** @ignore */
export function getCallerFileName(): string
{
	return getCallerCallSite().getFileName();
}

/** @ignore */
export function getCallerFunctionName(): string
{
	return getCallerCallSite().getFunctionName();
}

/** @ignore */
export function printStackTrace(): void
{
	const stack = getCallStack();

	let i = 0;

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
