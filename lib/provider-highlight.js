'use babel'

/* @flow */

import {Emitter, CompositeDisposable} from 'sb-event-kit'
import {Intention$Highlight} from './types'
import {visitSource} from './helpers'
import type {Disposable, TextEditor} from 'atom'
import type {Declaration} from './types'

type Intentions$Highlight = {textEditor: TextEditor, visibleRange: Range}

export class ProviderHighlight {
  emitter: Emitter;
  subscriptions: CompositeDisposable;
  grammarScopes: Array<string>;

  constructor() {
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()
    this.grammarScopes = ['*']

    this.subscriptions.add(this.emitter)
  }
  async getIntentions({textEditor, visibleRange}: Intentions$Highlight): Promise<Array<Intention$Highlight>> {
    const results = await this.requestDeclarations({textEditor, visibleRange})
    if (Array.isArray(results)) {
      return results.map(function(result) {
        return {
          range: result.range,
          created: function({element}) {
            element.addEventListener('click', function() {
              visitSource(result.source.filePath, result.source.position)
            })
          }
        }
      })
    }
    return []
  }
  async requestDeclarations({textEditor, visibleRange}: Intentions$Highlight): Promise<Array<Declaration>> {
    const event = {result: [], parameters: {textEditor, visibleRange}}
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
