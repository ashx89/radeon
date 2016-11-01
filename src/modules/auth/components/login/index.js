import { token } from 'utils';
import User from 'modules/auth/models/user';

const login = (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) return next(new Error('Invalid email or password'));

	User.findOne({ email }, (err, doc) => {
		if (err) return next(err);
		if (!doc) return next(new Error('Account does not exist'));

		doc.comparePassword(password, (compareErr, match) => {
			if (err) return next(err);
			if (!match) return next(new Error('Incorrect Password'));

			res.cookie('user', token.create(doc.toJSON(), req.app.locals.userCookieExpiry), { httpOnly: true });

			if (!err && match) return res.status(200).json(doc);
		});
	});
};

export default login;
