/* @flow */

import { Emitter, CompositeDisposable } from 'sb-event-kit'
import type { Disposable, TextEditor } from 'atom'
import { visitSource } from './helpers'
import type { IntentionHighlight, Declaration } from './types'

export default class ProviderHighlight {
  emitter: Emitter;
  subscriptions: CompositeDisposable;
  grammarScopes: Array<string>;

  constructor() {
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()
    this.grammarScopes = ['*']

    this.subscriptions.add(this.emitter)
  }
  async getIntentions({ textEditor, visibleRange }: { textEditor: TextEditor, visibleRange: Range }): Promise<Array<IntentionHighlight>> {
    const results = await this.requestDeclarations({ textEditor, visibleRange })

    return results.map(function(entry) {
      return {
        range: entry.range,
        created({ element }) {
          element.addEventListener('click', function() {
            visitSource(entry)
          })
        },
      }
    })
  }
  async requestDeclarations({ textEditor, visibleRange }: { textEditor: TextEditor, visibleRange: Range }): Promise<Array<Declaration>> {
    const event = {
      result: [],
      parameters: {
        textEditor,
        visibleRange,
      },
    }
    await this.emitter.emit('should-provide-declarations', event)
    return event.result
  }
  onShouldProvideDeclarations(callback: Function): Disposable {
    return this.emitter.on('should-provide-declarations', callback)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
