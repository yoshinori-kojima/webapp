import express from 'express';
import { Express } from 'express';
import fs from 'fs';
import path  from 'path';
import https from 'https';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';

import test from './routes/test';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
import menuRouter from './routes/menu';
import usersRouter from './routes/users';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

if (process.env.NODE_ENV === 'production') {
  console.log('production mode');

  // SSL証明書とキーの読み込み
  //const options = {
  //  key : fs.readFileSync(path.resolve(__dirname, '../certs/server.key')),
  //  cert: fs.readFileSync(path.resolve(__dirname, '../certs/server.crt'))
  //};
  //https.createServer(options, app).listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 8080, () => {console.log('start')});
  app.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 3000, () => {console.log('start')});
}

// POSTのBODYにJSONを使うため、body-parserを有効化
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cookieをパースするため、cookie-parserを有効化
app.use(cookieParser());

app.use('/api/test'    , test);

//login
app.use('/api/login'    , loginRouter);
//logout
app.use('/api/logout'   , logoutRouter);
//menu
app.use('/api/menu'     , menuRouter);
//user
app.use('/api/users'    , usersRouter);

if (process.env.NODE_ENV === 'production') {
  // それ以外のルートはReactアプリにフォールバックする
  app.get('*', (req, res) => {
    //res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
    res.sendFile(path.join('/usr/share/nginx/dist', 'index.html'));
  });
}

export default app;