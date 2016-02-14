'use babel'

/* @flow */

import type {Point} from 'atom'

export function visitSource(filePath: string, position: Point) {
  atom.workspace.open(filePath).then(function() {
    const textEditor = atom.workspace.getActiveTextEditor()
    if (textEditor && position) {
      textEditor.setCursorBufferPosition(position)
    }
  })
}
