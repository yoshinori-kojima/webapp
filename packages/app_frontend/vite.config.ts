import { defineConfig, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';
import { VitePluginNode } from 'vite-plugin-node';
import app from '../app_api/src/app';
import fs from 'fs';
import path from 'path';

/**
 *  The Express app plugin. Specify the url base path for app and Exrepss app Object.
 */
const expressServerPlugin = (path, expressApp) => ({
  name: 'configure-server',
  configureServer(server){
    server.middlewares.use(path, expressApp);
  }
});

// https://vitejs.dev/config/
export default defineConfig(async({ mode }: ConfigEnv) => {
  // プラグインリストを初期化
  const plugins = [react()];
  plugins.push([tsConfigPaths()]);
  // 開発モードのみ特定のプラグインを追加または設定変更
  if (mode === 'development') {
    console.log('***** mode:' + mode + ' *****');
    plugins.push([expressServerPlugin('/', app)]);  // build後にexpress serverを起動する
  }else{
    console.log('***** mode:' + mode + ' *****');
  }

  console.log(plugins);

  return{
    plugins: plugins,
    build:{
      chunkSizeWarningLimit: 1024, // 1 MB in kilobytes
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            //MODULE_LEVEL_DIRECTIVEのワーニングを無視する
            return
          }
        warn(warning)
      }}
    },
    server: {
      //https: {
      //  key : fs.readFileSync(path.resolve(__dirname, 'key.pem')),
      //  cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
      //},
      //proxy: {
      //  //'/api':{
      //  //  target: 'https://192.168.1.34:8080',
      //  //  changeOrigin: true,
      //  //  secure:false,
      //  //}
      //  //'/api': 'https://192.168.1.34:8080/api/'
      //},
      port: 8080,
      host:true,
    },

    resolve: {
      //preserveSymlinks: true, //true にすることで、@rollup/plugin-commonjs の都合などでエラーを減らせる場合があります
      alias: {
        // "shared" というエイリアスで、shared/src を参照しやすくする例
        'shared': path.resolve(__dirname, '../shared/src'),
        'app_api': path.resolve(__dirname, '../app_api/src')
      }
    },
  };
});