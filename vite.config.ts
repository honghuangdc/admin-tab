import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import windicss from 'vite-plugin-windicss';

export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, `.env.${configEnv.mode}`);

  const isVercel = viteEnv.VITE_IS_VERCEL === '1';

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      vue(),
      windicss(),
      dts({
        include: ['./src/index.ts', './src/ButtonTab.vue', './src/ChromeTab.vue'],
        beforeWriteFile(filePath, content) {
          return {
            filePath: filePath.replace('/dist/src/', '/dist/'),
            content
          };
        }
      })
    ],
    optimizeDeps: {
      exclude: ['vue-demi']
    },
    build: isVercel
      ? {
          brotliSize: false
        }
      : {
          lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            name: 'SoybeanAdminTab',
            fileName: 'index'
          },
          rollupOptions: {
            external: ['vue'],
            output: {
              globals: {
                vue: 'Vue'
              }
            }
          }
        }
  };
});
