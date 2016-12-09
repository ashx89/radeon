const baseConfig = {
	host: 'localhost',
	apiHost: 'api.localhost',
	port: 80,
	secret: 'JvxTnZCf87VfblEdy6s0z5KEGKWqUggJW3pat8s5',
	database: process.env.DATABASE || 'mongodb://localhost/radeon',

	locals: {
		application: {
			name: 'Radeon',
			email: 'kingsinbad0@gmail.com',
			passwordResetEmail: '',
			searchResultsLimit: 10,
			searchLocationDistance: 500,
			userCookieExpiry: 30000000000
		}
	},

	s3: {
		bucket: 'radeon',
		bucketUrl: 'http://radeon.s3.amazonaws.com/'
	},

	payments: {
		orderFeePercentage: 0,
		stripeSecretKey: '',
		stripePublishKey: ''
	},

	socialProviders: {
		facebook: {
			appId: '',
			appSecret: ''
		}
	},

	unless: [
		'/',
		'/verify',
		'/auth/login',
		'/auth/logout',
		'/auth/register',
		'/auth/password-forgot',
		'/auth/password-reset',
		'/auth/facebook',
		'/auth/facebook/callback'
	]
};

const developmentConfig = {};
const productionConfig = {};

export default Object.assign({}, baseConfig,
	process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig
);
