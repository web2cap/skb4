import express from 'express';
import cors from 'cors';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bunyan from 'bunyan';
import User from './models/User';
import getAuth from './resourses/Auth';
import getApi from './api';
import getMiddlewares from './middlewares';


global.__DEV__ = true;
// __STAGE__
global.__PROD__ = false;

const log = bunyan.createLogger({
  name: 'app',
  src: __DEV__,
  level: 'trace',
})

log.info('Starting');
const middlewares = getMiddlewares({
  log,
});
const models = {
  User,
  // User,
  // User,
  // User,
};
const auth = getAuth({
  log,
  models,
});


mongoose.connect('mongodb://publicdb.mgbeta.ru/isuvorov_skb4');

const app = express();


app.use(middlewares.reqLog);
app.use(middlewares.accessLogger);
app.use(middlewares.reqParser);
// app.use(middlewares.parseUser(this))
app.use(auth.parseToken);
app.use(auth.parseUser);

app.get('/', (req, res) => {
  res.json({
    hello: 'JS World',
  });
});

const secret = 'shhhhhhared-secret';

app.get('/token',
  function(req, res) {
    const data = {
      user: 'isuvorov',
      name: 'Igor Suvorov',
    };
    return res.json(jwt.sign(data, secret));
  });

app.get('/protected',
  expressJwt({secret}),
  function(req, res) {
    return res.json(req.user)
  });
app.all('/auth/validate', auth.validate);
app.post('/auth/signup', auth.signup);
app.post('/auth/login', auth.login);


const api = getApi({});
app.use('/api', api);




app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
