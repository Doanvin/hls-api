import * as express from 'express';
// import * as bodyParser from 'body-parser';
import * as statusControl from './controllers/status';
require('dotenv').config();

const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// app.use(bodyParser.urlencoded({ extended: false }));

app.set('port', process.env.HLS_PORT || 8082);

app.get('/', statusControl.hi);
app.get('/api/members', statusControl.members);
app.get('/api/members/:id', statusControl.memberId);

export default app;
