import 'app-module-path/register';

import bootstrap from './bootstrap';

import express from 'express';
const app = express();

bootstrap(app);
