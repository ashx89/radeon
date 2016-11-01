import async from 'async';
import config from 'config';
import { emailer, validation } from 'utils';
import { randomBytes } from 'crypto';

import User from 'modules/auth/models/user';

const application = config.locals.application;

const mailOptions = {
	subject: 'Password Reset'
};

const forgot = (req, res, next) => {
	const errors = validation('email', req);
	if (errors) return res.status(400).json(errors);

	const email = req.body.email;

	async.waterfall([
		function createRandomToken(callback) {
			randomBytes(20, (err, buffer) => callback(err, buffer.toString('hex')));
		},

		function saveTokenToDatabase(token, callback) {
			User.findOne({ email }, (err, user) => {
				if (err) return next(err);
				if (!user) return next(new Error('Account does not exist'));

				user.reset_password_token = token;
				user.reset_password_expiry = Date.now() + 300000;

				user.save((err) => callback(err, token, user));
			});
		},

		function sendResetEmail(token, user, callback) {
			const link = `https://${config.apiHost}/auth/password-reset?token=${token}`;

			mailOptions.to = email;
			mailOptions.html = `<p>We\'ve received request to reset the password to this account.</p>\n\n
				<p>To reset your password, please click on this link (expires in 24 hours):
					<a href="${link}">Reset Password</a>
				</p>`;

			emailer(mailOptions, (err) => callback(err, token));
		}
	], (err, token) => {
		console.log(err);
		if (err) return next(err);
		return res.status(200).json(token);
	});
};

export default forgot;
