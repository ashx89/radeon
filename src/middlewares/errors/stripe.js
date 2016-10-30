function PaymentError(err, req, res, next) {
	const error = {
		code: err.code || 10020,
		path: req.path,
		errors: []
	};

	switch (err.type) {
	case 'StripeCardError':
		error.status = err.statusCode || err.code;
		error.title = 'Card Error';
		error.message = err.message;
		break;
	case 'RateLimitError':
		error.status = err.statusCode || err.code;
		error.title = 'Too Many Requests';
		error.message = err.message;
		break;
	case 'StripeInvalidRequestError':
		error.status = err.statusCode || err.code;
		error.title = 'Request Error';
		error.message = err.message;
		break;
	case 'StripeAPIError':
		error.status = err.statusCode || err.code;
		error.title = 'API Error';
		error.message = err.message;
		break;
	case 'StripeConnectionError':
		error.status = err.statusCode || err.code;
		error.title = 'Connection Error';
		error.message = err.message;
		break;
	case 'StripeAuthenticationError':
		error.status = err.statusCode || err.code;
		error.title = 'Authentication Error';
		error.message = err.message;
		break;
	default:
		return next(err);
	}

	error.errors.push({
		message: error.message,
		name: error.title
	});

	return res.status(error.status).json(error);
}

PaymentError.prototype = new Error();

export default PaymentError;
