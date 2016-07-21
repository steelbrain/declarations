/* @flow */

import type { Declaration, Provider } from './types'

export function visitSource(declaration: Declaration): Promise<void> {
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

export function showError(title: string, description: string, points: Array<string>) {
  const renderedPoints = points.map(item => `  • ${item}`)
  atom.notifications.addWarning(`[Declarations] ${title}`, {
    dismissable: true,
    detail: `${description}\n${renderedPoints.join('\n')}`,
  })
}

export function shouldTriggerProvider(scopes: Array<string>, provider: Provider): boolean {
  return scopes.some(scope => provider.grammarScopes.indexOf(scope) !== -1)
}
