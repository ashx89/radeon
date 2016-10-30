import fs from 'fs';
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';

import config from '../config';

export default function start(app) {
	mongoose.connect(config.database);

	const httpsServer = https.createServer({
		key: fs.readFileSync('./server.key'),
		cert: fs.readFileSync('./server.crt')
	}, app).listen(443);

	const httpServer = http.createServer(app).listen(80);

	httpsServer.on('listening', () => console.log('OK, https is running'));
	httpsServer.on('listening', () => console.log('OK, http is running'));
}
