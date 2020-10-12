class InvalidPathError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'InvalidPathError';
    }
}

class PathIsNotADirectoryError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'PathIsNotADirectoryError';
    }
}

module.exports = {
    InvalidPathError,
    PathIsNotADirectoryError
}