import config from 'config';
import { createTransport } from 'nodemailer';

const application = config.locals.application;
const transporter = createTransport(application.passwordResetEmail);

const defaultMailOptions = {
	from: `${application.name} <${application.email}>`,
	subject: `Message from ${application.name}`
};

export default function sendMail(options, callback) {
	const mailOptions = Object.assign(options, defaultMailOptions);
	transporter.sendMail(mailOptions, (err) => callback(err));
}
