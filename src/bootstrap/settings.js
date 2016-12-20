import config from '../config';

const sslOptions = {
	httpsPort: 443,
	trustXFPHeader: false,
	enable301Redirects: true,
	sslRequiredMessage: 'SSL Required.'
};

export default function settings(app) {
	app.set('json spaces', 2);
	app.enable('trust proxy');
	app.disable('x-powered-by');
	app.set('port', process.env.PORT || config.port);
	app.set('forceSSLOptions', sslOptions);
}
