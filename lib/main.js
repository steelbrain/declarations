'use babel'

/* @flow */

import type {TextEditor, Range} from 'atom'
import type {Intention} from './types'

export class Main {
  grammarScopes: Array<string>;

  constructor() {
    this.grammarScopes = ['*']
  }
  async getIntentions({textEditor, visibleRange}: {textEditor: TextEditor, visibleRange: Range}): Promise<Array<Intention>> {
    console.log('get intentions')
    return []
  }
}
