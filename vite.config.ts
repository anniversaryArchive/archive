import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import graphql from '@rollup/plugin-graphql';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    graphql(),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
