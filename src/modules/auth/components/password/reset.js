import async from 'async';
import config from 'config';
import { token, email } from 'utils';

import User from 'modules/auth/models/user';

const application = config.locals.application;

const mailOptions = {
	subject: 'Your password has been updated'
};

/**
 * Check if the user has a valid password reset token
 * @param {object} req. Request object containing the ?token= query
 * @param {function} callback.
 */
function queryUserToken(req, callback) {
	const resetToken = req.query.token ? req.query.token : '';
	if (!resetToken) return callback(new Error('No reset token found'), null);

	const query = {
		reset_password_token: resetToken,
		reset_password_expiry: { $gt: Date.now() }
	};

	User.findOne(query, (err, user) => {
		if (err) return callback(err);
		if (!user) return callback(new Error('Password reset token is invalid or has expired'));

		return callback(null, user);
	});
}

/**
 * Password reset GET
 * @param {function} callback.
 */
export function passwordResetGet(req, res, next) {
	queryUserToken((err, user) => {
		if (err) return next(err);
		return res.status(200).json(user);
	});
}

/**
 * Password reset POST
 * 1. Fetch the users token
 * 2. Update the password and create a new cookie for the user
 * 3. Send an email confirming password change
 */
export function passwordResetPost(req, res, next) {
	async.waterfall([
		async.apply(queryUserToken, req),
		function updatePasswordAndCookie(user, callback) {
			user.password = req.body.password;
			user.reset_password_token = undefined;
			user.reset_password_expiry = undefined;

			user.save((err) => {
				res.cookie('user', token.create(user.toJSON(), req.app.locals.userCookieExpiry), { httpOnly: true });
				return callback(err, user);
			});
		},

		function sendEmailConfirmation(user, callback) {
			mailOptions.to = user.email;
			mailOptions.html = `
				'<h3>Password Changed Complete!</h3>\n\n
				<p>Your password has been updated for account: <b>${user.email}</b>`;

			email(mailOptions, (err) => callback(err, user));
		}
	], (err, user) => {
		if (err) return next(err);
		return res.status(200).json(user);
	});
}
