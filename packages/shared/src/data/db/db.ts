import { Sequelize } from 'sequelize';
import { initModels } from './models/init-models.js';
//import devConfig from '../../config/config_dev.json' assert { type: "json" }
//import prodConfig from '../../config/config_dev.json' assert {type: "json"};
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// ES Modulesで__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DbCtx {
  public db: Sequelize | undefined = undefined;
  public models : any | undefined = undefined;
  /**
   * コンストラクタ
   */
  public constructor(){
    const env     = process.env.NODE_ENV || 'development';
    let config : any;
    if(env === 'production'){
      config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../config/config_prod.json"), "utf-8"))
    }else{
      config = JSON.parse(fs.readFileSync("./config/config_dev.json", "utf-8"));
    }
    //const config  = require('../../config/config.json')[env];
    this.db       = new Sequelize(config.database, config.username, config.password, config);
    //モデル初期化
    this.models   = initModels(this.db);
  }
}

export default DbCtx;
