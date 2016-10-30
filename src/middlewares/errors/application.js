function ApplicationError(err, req, res, next) {
	const error = {
		code: err.code || 10010,
		path: req.path,
		errors: []
	};

	switch (err.name) {
	case 'UnauthorizedError':
		error.status = 401;
		error.title = 'Unauthorized';
		error.message = 'You need to be authenticated to use this resource';
		break;
	default:
		error.status = 400;
		error.title = err.title || 'Invalid';
		error.message = err.message || 'Invalid Request';
	}

	error.errors.push({
		message: error.message,
		name: error.title
	});

	return res.status(error.status).json(error);
}

ApplicationError.prototype = new Error();

export default ApplicationError;
