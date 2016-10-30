import verification from './verification';
import application from './application';
import settings from './settings';
import routes from './routes';
import vhosts from './vhosts';
import locals from './locals';
import start from './start';

import { errors } from '../middlewares';

export default function bootstrap(app) {
	application(app);
	settings(app);
	locals(app);
	verification(app);
	vhosts(app);
	routes(app);	
	errors(app);
	start(app);
}
