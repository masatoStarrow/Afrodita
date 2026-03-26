import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@pages':      resolve(__dirname, 'src/pages'),
      '@store':      resolve(__dirname, 'src/store'),
      '@services':   resolve(__dirname, 'src/services'),
      '@hooks':      resolve(__dirname, 'src/hooks'),
      '@app-types':  resolve(__dirname, 'src/types'),
      '@constants':  resolve(__dirname, 'src/constants'),
      '@utils':      resolve(__dirname, 'src/utils'),
      '@styles':     resolve(__dirname, 'src/styles'),
      '@assets':     resolve(__dirname, 'src/assets'),
      '@config':     resolve(__dirname, 'src/config'),
    },
  },
})
