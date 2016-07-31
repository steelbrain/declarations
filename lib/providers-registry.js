/* @flow */

import type { TextEditor } from 'atom'
import { processDeclarations, processProvider } from './process'
import { shouldTriggerProvider } from './helpers'
import type { Provider, Declaration } from './types'

export default class ProvidersRegistry {
  providers: Set<Provider>;

  constructor() {
    this.providers = new Set()
  }
  addProvider(provider: Provider) {
    if (processProvider(provider)) {
      this.providers.add(provider)
    }
  }
  deleteProvider(provider: Provider): void {
    this.providers.delete(provider)
  }
  async trigger({ textEditor, visibleRange }: { textEditor: TextEditor, visibleRange: Range }): Promise<Array<Declaration>> {
    const editorPath = textEditor.getPath()
    const bufferPosition = textEditor.getCursorBufferPosition()

    if (!editorPath) {
      // Ignore editors that are not saved on disk
      return []
    }

    const scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray()
    scopes.push('*')

    const promises = []
    for (const provider of this.providers) {
      if (!shouldTriggerProvider(scopes, provider)) {
        continue
      }
      promises.push(new Promise(function(resolve) {
        resolve(provider.getDeclarations({ textEditor, visibleRange }))
      }).then(processDeclarations, function(error) {
        atom.notifications.addError('[Declarations] Error running provider', {
          detail: 'See console for more info',
        })
        console.error('[Declarations] Error running provider', provider, error)
      }))
    }

    const results = await Promise.all(promises)
    return results.reduce(function(toReturn, entry) {
      if (Array.isArray(entry)) {
        return toReturn.concat(entry)
      }
      return toReturn
    }, [])
  }
  dispose() {
    this.providers.clear()
  }
}
