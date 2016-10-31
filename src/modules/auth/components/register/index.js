import async from 'async';
import config from 'config';
import User from 'modules/auth/models/user';
import { token, validation } from 'utils';

const register = (req, res, next) => {
	const user = new User(req.body);

	async.waterfall([
		function validate(callback) {
			let errors = null;
			errors = validation('email', req);
			errors = validation('password', req);

			if (errors) return res.status(400).json(errors);
			return callback(null);
		},

		function createUser(callback) {
			User.findOne({ email: user.email }, (err, exists) => {
				if (err) return callback(err);
				if (exists) return callback(new Error('User already exists'));

				user.save((err) => {
					if (err) return callback(err);
					user.resource = `${config.s3.bucketUrl}${user._id}/`;
					return callback(null);
				});
			});
		},

		function saveAndReturnToken(callback) {
			user.save((err) => {
				if (err) return callback(err);

				res.cookie('user',
					token.create(user.toJSON(), req.app.locals.userCookieExpiry), { httpOnly: true });

				return callback(null);
			});
		}], (err) => {
			if (err) return next(err);
			return res.status(200).json(user);
		});
};

export default register;
