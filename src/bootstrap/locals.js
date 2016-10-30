import config from 'config';

export default function locals(app) {
	return Object.assign(app.locals, config.locals);
};
