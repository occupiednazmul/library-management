import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  outDir: '../server',
  dts: true,
  clean: true,
  target: 'esnext',
  platform: 'node'
})
