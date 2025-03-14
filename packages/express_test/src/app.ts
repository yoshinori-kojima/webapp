import express from 'express';
import fs from 'fs';
import path  from 'path';
import https from 'https';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import test from './routes/test';

const app = express();

// POSTのBODYにJSONを使うため、body-parserを有効化
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cookieをパースするため、cookie-parserを有効化
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  console.log('production mode');

  // SSL証明書とキーの読み込み
  const options = {
    key : fs.readFileSync(path.resolve(__dirname, '../certs/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certs/server.crt'))
  };
  https.createServer(options, app).listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 8080, () => {console.log('start')});
}

app.use('/api/test'    , test);

app.get('/', (req, res) => {
  res.send('Hello from Express + Vite ES build');
});

export default app;