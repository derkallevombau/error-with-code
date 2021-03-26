"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
function error(...args) {
    switch (args.length) {
        case 1:
            if (typeof args[0] === 'string') {
                let message = args[0];
                if (this.messagePrefix)
                    message = this.messagePrefix + ' ' + message;
                const e = new Error(message);
                if (this.code)
                    e.code = this.code;
                throw e;
            }
            else {
                const options = args[0];
                for (const propName in options) {
                    this[propName] = options[propName];
                }
            }
            break;
        case 2:
            {
                let message = args[0];
                if (this.messagePrefix)
                    message = this.messagePrefix + ' ' + message;
                const e = new Error(message);
                e.code = args[1];
            }
    }
}
exports.error = error;
//# sourceMappingURL=error-with-code.js.map