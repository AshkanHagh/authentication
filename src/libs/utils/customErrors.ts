import ErrorHandler from './errorHandler';

class ValidationError extends ErrorHandler {
    constructor(message : string) {
        super(message, 400);
    }
}

class RouteNowFoundError extends ErrorHandler {
    constructor(message : string) {
        super(message, 404);
    }
}

class BadRequestError extends ErrorHandler {
    constructor(message : string = 'Bad request') {
        super(message, 400);
    }
}

class UnauthorizedError extends ErrorHandler {
    constructor(message : string = 'Unauthorized') {
        super(message, 401);
    }
}

class ForbiddenError extends ErrorHandler {
    constructor(message : string = 'Forbidden') {
        super(message, 403);
    }
}

class ResourceNotFoundError extends ErrorHandler {
    constructor(message : string = 'Resource not found') {
        super(message, 404);
    }
}

class InvalidUserIdError extends ErrorHandler {
    constructor(message : string = 'Invalid id - User not found') {
        super(message, 400);
    }
}

class TokenRefreshError extends ErrorHandler {
    constructor(message : string = 'Could not refresh token') {
        super(message, 400);
    }
}

class LoginRequiredError extends ErrorHandler {
    constructor(message : string = 'Please login to access this resource') {
        super(message, 401);
    }
}

class AccessTokenInvalidError extends ErrorHandler {
    constructor(message : string = 'Access token is not valid') {
        super(message, 401);
    }
}

class InternalServerError extends ErrorHandler {
    constructor(message : string = 'Internal server error') {
        super(message, 500);
    }
}

class UserNotFoundError extends ErrorHandler {
    constructor(message : string = 'User not found') {
        super(message, 404);
    }
}

class InvalidVerifyCode extends ErrorHandler {
    constructor(message : string = 'Invalid verify code') {
        super(message, 400)
    }
}

class EmailAlreadyExists extends ErrorHandler {
    constructor(message : string = 'Email or Username already exists') {
        super(message, 409);
    }
}

class InvalidEmailError extends ErrorHandler {
    constructor(message : string = 'Invalid email') {
        super(message, 401);
    }
}


export {BadRequestError, UnauthorizedError, ForbiddenError, ResourceNotFoundError, InvalidUserIdError, LoginRequiredError, 
    InternalServerError, AccessTokenInvalidError, ValidationError, TokenRefreshError, RouteNowFoundError, UserNotFoundError,
    InvalidEmailError, EmailAlreadyExists, InvalidVerifyCode
};