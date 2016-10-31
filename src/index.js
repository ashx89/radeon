import 'app-module-path/register';
import express from 'express';
const app = express();

import bootstrap from './bootstrap';
bootstrap(app);

export default app;
