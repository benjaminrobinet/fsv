import {
  createConsola,
  LogLevels,
  type ConsolaOptions,
  type ConsolaInstance
} from 'consola'

export const Logger = {
  create,
  levels: LogLevels
}

function create(options?: Partial<ConsolaOptions>): ConsolaInstance {
  return createConsola(options).withTag('fsv')
}
