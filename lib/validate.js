/* @flow */

import type {Provider, Declaration} from './types'

export function validateDeclarations(declarations: Array<Declaration>) {
  if (Array.isArray(declarations)) {
    const length = declarations.length
    for (let i = 0; i < length; ++i) {
      const entry = declarations[i]
      let message
      if (!entry.range || typeof entry.range !== 'object') {
        message = 'Invalid or no range found on declaration'
      }
      if (!entry.source || (typeof entry.source !== 'object' && typeof entry.source !== 'function')) {
        message = 'Invalid or no source found on declaration'
      } else if (typeof entry.source === 'object') {
        if (typeof entry.source.filePath !== 'string') {
          message = 'Invalid or no source.filePath found on declaration'
        } else if (entry.source.position && typeof entry.source.position !== 'object') {
          message = 'Invalid source.position found on declaration'
        }
      }

      if (message) {
        console.log('[Declarations] Invalid declaration encountered', entry)
        throw new Error(message)
      }
    }
  }
}

export function validateProvider(provider: Provider) {
  let message
  if (!provider || typeof provider !== 'object') {
    message = 'Invalid provider provided'
  } else if (!Array.isArray(provider.grammarScopes)) {
    message = 'Invalid or no grammarScopes found on provider'
  } else if (typeof provider.getDeclarations !== 'function') {
    message = 'Invalid or no getDeclarations found on provider'
  }
  if (message) {
    console.log('[Declarations] Invalid provider', provider)
    throw new Error(message)
  }
}
