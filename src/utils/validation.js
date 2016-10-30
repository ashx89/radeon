export default function validation(type, req) {
	let errors = null;

	switch (type) {
	case 'email':
		req.checkBody('email', 'Invalid Email').isEmail();
		errors = req.validationErrors()[0];
		break;
	case 'password':
		req.checkBody('password', 'Password must be at least 8 characters').isLength(8, 20);
		errors = req.validationErrors()[0];
		break;
	default:
		return errors;
	}

	return errors;
}
