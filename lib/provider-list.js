'use babel'

/* @flow */

import {Range, Emitter, CompositeDisposable} from 'atom'
import {visitSource} from './helpers'
import type {Point, Disposable, TextEditor} from 'atom'
import type {Intention$List, Declaration} from './types'

type Intentions$List = {textEditor: TextEditor, bufferPosition: Point}

export class ProviderList {
  emitter: Emitter;
  subscriptions: CompositeDisposable;
  grammarScopes: Array<string>;

  constructor() {
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()
    this.grammarScopes = ['*']

    this.subscriptions.add(this.emitter)
  }
  async getIntentions({textEditor, bufferPosition}: Intentions$List): Promise<Array<Intention$List>> {
    const results = await this.requestDeclarations({textEditor, bufferPosition})
    if (Array.isArray(results)) {
      let result
      for (const entry of results) {
        const range = Range.fromObject(entry.range)
        if (range.containsPoint(bufferPosition)) {
          result = entry
          break
        }
      }
      if (result) {
        return [{
          priority: 100,
          icon: 'alignment-align',
          title: 'Jump to declaration',
          selected: function() {
            visitSource(result.source.filePath, result.source.position)
          }
        }]
      }
    }
    return []
  }
  async requestDeclarations({textEditor, bufferPosition}: Intentions$List): Promise<Array<Declaration>> {
    const event = {promise: Promise.resolve([]), parameters: {textEditor, visibleRange: [[bufferPosition.row, 0], [bufferPosition.row, Infinity]]}}
    this.emitter.emit('should-provide-declarations', event)
    return await event.promise
  }
  onShouldProvideDeclarations(callback: Function): Disposable {
    return this.emitter.on('should-provide-declarations', callback)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
