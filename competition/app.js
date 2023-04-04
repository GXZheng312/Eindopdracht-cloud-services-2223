const express = require('express');

const app = express();

require('dotenv').config();
require('./services/database')();

require('./models/image');
require('./models/targetImage');

require('./seeds/seeder');

module.exports = app;