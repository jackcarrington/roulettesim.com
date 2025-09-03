import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@components': '/src/components',
      '@layouts': '/src/layouts',
      '@stores': '/src/stores',
      '@services': '/src/services',
      '@types': '/src/types',
      '@utils': '/src/utils',
    },
  },
});