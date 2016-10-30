import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const token = {
	/**
	 * Set application configuration
	 * @param {object} config
	 */
	setConfig: (config) => {
		token.config = config;
	},

	/**
	 * Generate token
	 * @param {object} object. Data to sign to token
	 * @param {number} expiresIn. When to expire token (seconds?)
	 */
	create: (object, expiresIn) => {
		if (!expiresIn)
			expiresIn = token.config.locals.application.userCookieExpiry;

		return jwt.sign(object, token.config.secret, { expiresIn });
	},

	/**
	 * Get a token
	 * @param {object} req. Request data from express
	 * @param {string} key. Token to get from cookie
	 */
	get: (req, key) => req.cookies[key] || null,

	/**
	 * Fetch token
	 * @param {object} req. Request data from express
	 */
	fetch: (req) => {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return req.headers.authorization.split(' ')[1];
		} else if (req.query && req.query.token) {
			return req.query.token;
		} else if (req.cookies.user) {
			return req.cookies.user;
		}
		return null;
	},

	/**
	 * Verify and decode token (non middleware)
	 * @param {object} token
	 * @param {function} callback
	 */
	decode: (tokenData, callback) => {
		jwt.verify(tokenData, token.config.secret, (err, decode) => callback(err, decode));
	},

	/**
	 * Verify token
	 * @param {object} data from express
	 */
	verify: (req, res, next) => {
		const tokenData = token.fetch(req);

		jwt.verify(tokenData, token.config.secret, (err, decode) => {
			if (err) return next(err);
			req.decoded = decode;
			return next();
		});
	},

	/**
	 * Express middleware to check for token on route handlers
	 */
	require: () =>
		expressJwt({
			secret: token.config.secret,
			getToken: token.fetch
		}).unless({ path: token.config.unless })
};

export default token;
