import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import expressForceSSL from 'express-force-ssl';
import expressValidator from 'express-validator';

export default function application(app) {
	app.use(helmet.hsts({
		maxAge: 123000,
		includeSubdomains: true,
		force: true
	}));

	app.use(bodyParser.urlencoded({
		keepExtensions: true,
		extended: true
	}));

	app.use(bodyParser.json());

	app.use(expressValidator({
		errorFormatter(param, message, value) {
			return {
				status: 400,
				value,
				param,
				message,
				code: 'invalid_input',
				name: 'ValidationError',
				title: 'Validation Error'
			};
		}
	}));

	app.use(cookieParser());
	app.use(methodOverride());
	app.use(expressForceSSL);
}
