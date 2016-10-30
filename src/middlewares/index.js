import application from './errors/application';
import validation from './errors/validation';
import stripe from './errors/stripe';

export function errors(app) {
	app.use(validation);
	app.use(stripe);
	app.use(application);
}
