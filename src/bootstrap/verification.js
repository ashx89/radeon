import config from 'config';
import { token } from 'utils';

export default function verification(app) {
	token.setConfig(config);
	app.use(token.require());
};
