function ValidationError(err, req, res, next) {
	let errorName = null;

	const error = {
		code: err.code,
		path: req.path,
		errors: []
	};

	switch (err.name) {
	case 'ValidationError':
		error.code = 'invalid_input';
		error.status = 400;
		error.title = 'Validation Error';
		for (let i = 0; i < Object.keys(err.errors).length; i++) {
			errorName = Object.keys(err.errors)[i];
			error.errors.push({
				message: err.errors[errorName].message,
				name: errorName
			});
		}
		break;
	default:
		return next(err);
	}

	return res.status(error.status).json(error);
}

ValidationError.prototype = new Error();

export default ValidationError;
