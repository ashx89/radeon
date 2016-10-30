import vhost from 'vhost';
import config from '../config';

import {
	auth
} from 'modules';

export default function vhosts (app) {
	app.use(vhost(config.apiHost, auth));
}
