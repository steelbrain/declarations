'use babel'

/* @flow */

import type {Point} from 'atom'
import type {Declaration} from './types'

export function visitSource(declaration: Declaration): Promise {
  return new Promise(function(resolve) {
    resolve(typeof declaration.source === 'function' ? declaration.source.call(declaration) : declaration.source)
  }).then(function(source) {
    return atom.workspace.open(source.filePath).then(function() {
      const textEditor = atom.workspace.getActiveTextEditor()
      if (textEditor && source.position) {
        textEditor.setCursorBufferPosition(source.position)
      }
    })
  })
}
