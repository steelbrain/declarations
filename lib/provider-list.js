'use babel'

/* @flow */

import {Emitter, CompositeDisposable} from 'atom'
import {Intention$Highlight} from './types'
import type {Range, Point, Disposable, TextEditor} from 'atom'
import type {Declaration} from './types'

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
  async getIntentions({textEditor, bufferPosition}: Intentions$List): Promise<Array<Intention$Highlight>> {
    const results = await this.requestDeclarations({textEditor, bufferPosition})
    console.log('declarations', results)
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
