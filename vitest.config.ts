import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: '[local]',
    },
  },
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
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      threshold: { lines: 80, functions: 80 },
    },
  },
})
