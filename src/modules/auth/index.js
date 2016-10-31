import express from 'express';
const app = express();

import {
	login,
	logout,
	register,
	passwordForgot,
	passwordResetGet,
	passwordResetPost,
} from './components';

app.post('/auth/login', login);
app.post('/auth/logout', logout);
app.post('/auth/register', register);

app.post('/auth/password-forgot', passwordForgot);

app.get('/auth/password-reset', passwordResetGet);
app.post('/auth/password-reset', passwordResetPost);

export default app;
