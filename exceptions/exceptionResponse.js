function exceptionResponse(exception) {
    console.log('Siu: ' + exception);
    var message = {
        // "name": exception.name,
        "errors": exception.errors.map(error => error.message)
    };
    return { code: 400, message };
}

export default exceptionResponse;