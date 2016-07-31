/* @flow */

import { Point, Range } from 'atom'
import { showError } from './helpers'
import type { Provider, Declaration } from './types'

export function processDeclarations(declarations: Array<Declaration>): Array<Declaration> {
  const messages = []
  if (Array.isArray(declarations)) {
    let invalidRange = false
    let invalidSource = false

    for (let i = 0, length = declarations.length; i < length; ++i) {
      const entry = declarations[i]
      if (!invalidRange && (!entry.range || typeof entry.range !== 'object')) {
        invalidRange = true
        messages.push('message.range must be valid')
      } else if (!invalidRange && entry.range.constructor.name === 'Array') {
        entry.range = Range.fromObject(entry.range)
      }
      if (!invalidSource && (!entry.source || (typeof entry.source !== 'object' && typeof entry.source !== 'function'))) {
        invalidSource = true
        messages.push('message.source must be valid')
      }
      if (!invalidSource && typeof entry.source === 'object' && typeof entry.source.filePath !== 'string') {
        invalidSource = true
        messages.push('message.source.filePath must be a string')
      }
      if (!invalidSource && typeof entry.source === 'object' && (entry.source.position && typeof entry.source.position !== 'object')) {
        invalidSource = true
        messages.push('message.source.range must be a valid Range')
      } else if (!invalidSource && entry.source.position && entry.source.position.constructor.name === 'Array') {
        entry.source.position = Point.fromObject(entry.source.position)
      }
    }
  }

  if (messages.length) {
    showError('Invalid Declarations received', 'These issues were encountered while processing results from a declarations provider', messages)
    return []
  }
  return declarations || []
}

export function processProvider(provider: Provider): boolean {
  const messages = []

  if (!provider || typeof provider !== 'object') {
    messages.push('provider must be an object')
  } else {
    if (!Array.isArray(provider.grammarScopes)) {
      messages.push('provider.grammarScopes must be an Array')
    }
    if (typeof provider.getDeclarations !== 'function') {
      messages.push('provider.getDeclarations must be a function')
    }
  }
  if (messages.length) {
    showError('Invalid Provider received', 'These issues were encountered while registering a declarations provider', messages)
    return false
  }
  return true
}
