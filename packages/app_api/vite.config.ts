// packages/server/vite.config.ts
import fs from 'fs';
import path from 'path';
import { defineConfig, ConfigEnv, UserConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import tsConfigPaths from 'vite-tsconfig-paths';
//import mkcert from 'vite-plugin-mkcert';
import { fileURLToPath } from 'url';

import app from './src/app';

// ES Modulesで__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressServerPlugin = (path, expressApp) => ({
  name: 'configure-server',
  configureServer(server){
    server.middlewares.use(path, expressApp);
  }
});

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const plugins = ([tsConfigPaths()]);

  if(mode === 'development'){
    //開発
    plugins.push(expressServerPlugin('/', app));  // build後にexpress serverを起動する
  }else if(mode === 'production'){
    //本番

  }

  return {
    // 共通設定
    //plugins: [
      // これにより「ExpressアプリをNode.jsとして起動 & ホットリロード」する開発環境が構築される
      //VitePluginNode({
      //  adapter: 'express',       //express 起動
      //  appPath: './src/app.ts',  //express アプリのエントリーファイル
      //  exportName: 'app',  //express アプリのエントリーファイルのエクスポート名
      //}),
      //tsConfigPaths(),
      //mkcert(),
    //],
    plugins: plugins,

    // 開発サーバ設定
    server: {
      port: 8080,
      host:true,
      //https: {
      //  key: fs.readFileSync(path.resolve(__dirname, 'certs/server.key')),
      //  cert: fs.readFileSync(path.resolve(__dirname, 'certs/server.crt'))
      //  //key : fs.readFileSync('/home/yoshinori/program/react.js/vite/pnpm_portfolio/packages/app_api/key.pem'),
      //  //cert: fs.readFileSync('/home/yoshinori/program/react.js/vite/pnpm_portfolio/packages/app_api/cert.pem'),
      //},
      //proxy: { //TLSにダウングレード
      //  //'/api':{
      //  //  target: 'https://192.168.1.34:8080',
      //  //  changeOrigin: true,
      //  //  secure:false,
      //  //}
      //  //'/api': 'https://192.168.1.34:8080/api/'
      //  },
    },

    // 依存の外部化設定 (optimizeDeps)
    optimizeDeps: {
      exclude: ['express'] // express は外部化
    },

    // 本番ビルド(SSR用)
    build: {
      // SSRビルドを指定 (サーバサイドバンドル)
      ssr: 'src/app.ts',
      outDir: 'dist',
      // Rollupの設定で external を指定するかどうかはお好みで
      rollupOptions: {
        output: {
          format: 'es',
          entryFileNames: 'app.js',
          //preserveModules: true, // モジュールを保持する
        },
        // express を外部化する例 (dist には含まれない)
        // Node 実行時には node_modules から読み込む
        external: ['express', 'fs'],
      },
    },

    // SSRモード向けオプション
    ssr: {
      // もし外部化したくないライブラリがあるなら noExternal に書く
      // noExternal: ['some-other-package']
    },


    resolve: {
      //preserveSymlinks: true, //true にすることで、@rollup/plugin-commonjs の都合などでエラーを減らせる場合があります
      alias: {
        // "shared" というエイリアスで、shared/src を参照しやすくする例
        'shared': path.resolve(__dirname, '../shared/src')
      }
    },
  };
});


//function localVitePluginNode(arg0: {
//  // アダプタに "express" を指定することで、自動的に express を起動
//  adapter: string;
//  // Expressアプリのエントリーファイルを指定
//  // (相対パスの場合は vite.config.ts からの相対)
//  appPath: string;
//  // 開発時に export されるサーバインスタンス(上記 index.ts の `viteNodeApp`)を探す設定
//  exportName: string;
//}) {
//  throw new Error('Function not implemented.');
//}
