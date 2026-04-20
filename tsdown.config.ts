import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  unbundle: true,
  format: ['esm', 'cjs'],
  entry: ['src/**/*.ts'],

  exports: {
    bin: true
  },

  loader: {
    '.vert': 'text',
    '.frag': 'text'
  }
})
