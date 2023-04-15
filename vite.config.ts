import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import graphql from '@rollup/plugin-graphql';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      graphql(),
      quasar({
        sassVariables: 'src/quasar-variables.sass'
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            clientID: env.VITE_CLIENTID,
            googleClientID: env.GOOGLE_CLIENTID
          }
        }
      }),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  };
});
