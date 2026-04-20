import { defineCommand } from 'citty'
import pkg from '~~/package.json'

export default defineCommand({
  meta: {
    name: pkg.name.split('/').pop(),
    version: pkg.version,
    description: pkg.description
  },
  subCommands: {
    convert: () => import('./convert').then(module => module.default)
  }
})
