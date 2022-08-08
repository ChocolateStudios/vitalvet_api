export function exceptionResponse(exception) {

    if (exception.errors) {
        var message = {
            "errors": exception.errors.map(error => error.message)
        };
        console.log('Exceptions are: ' + exception);
        return { code: 400, message };
    }

    if (exception.code) {
        console.log('Exception code: ' + exception.code + ' / Exception message: ' + exception.message);
        return { code: exception.code, message: exception.message };
    }

    console.log('Server error: ' + exception);
    return { code: 500, message: 'server error' };
}

export function customException(code, message) {
    const error = new Error(message);
    error.code = code;

    return error;
}

customException.prototype = Object.create(Error.prototype);