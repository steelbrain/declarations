/* @flow */

import { Emitter, CompositeDisposable } from 'sb-event-kit'
import { Range } from 'atom'
import type { Point, Disposable, TextEditor } from 'atom'
import { visitSource } from './helpers'
import type { IntentionList, Declaration } from './types'

export default class ProviderList {
  emitter: Emitter;
  subscriptions: CompositeDisposable;
  grammarScopes: Array<string>;

  constructor() {
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()
    this.grammarScopes = ['*']

    this.subscriptions.add(this.emitter)
  }
  async getIntentions({ textEditor, bufferPosition }: { textEditor: TextEditor, bufferPosition: Point }): Promise<Array<IntentionList>> {
    const results = await this.requestDeclarations({ textEditor, bufferPosition })
    for (let i = 0, length = results.length; i < length; ++i) {
      const entry: Declaration = results[i]
      if (entry.range.containsPoint(bufferPosition)) {
        return [{
          priority: 100,
          icon: 'alignment-align',
          title: 'Jump to declaration',
          selected: () => visitSource(entry),
        }]
      }
    }
    return []
  }
  async requestDeclarations({ textEditor, bufferPosition }: { textEditor: TextEditor, bufferPosition: Point }): Promise<Array<Declaration>> {
    const event = {
      result: [],
      parameters: {
        textEditor,
        visibleRange: Range.fromObject([[bufferPosition.row, 0], [bufferPosition.row, Infinity]]),
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
