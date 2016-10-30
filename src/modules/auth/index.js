import express from 'express';
const app = express();

import {
	login,
	logout,
	register
} from './components';

app.post('/auth/login', login);
app.post('/auth/logout', logout);
app.post('/auth/register', register);

// app.post('/auth/password-forgot', passwordForgot);

// app.get('/auth/password-reset', passwordReset);
// app.post('/auth/password-reset', passwordReset);
export default app;
