import config from 'config';
import { createTransport } from 'nodemailer';

const application = config.locals.application;
const transporter = createTransport(application.passwordResetEmail);

const defaultMailOptions = {
	to: '',
	from: `${application.name} <${application.email}>`,
	subject: `Message from ${application.name}`
};

export default function sendMail(options = defaultMailOptions, callback) {
	transporter.sendMail(options, (err) => callback(err));
}
