'use babel'

/* @flow */

import {ProvidersRegistry} from './providers-registry'
import {validateProvider as validate} from './validate'
import type {TextEditor, Range} from 'atom'
import type {Provider, Intention} from './types'

export class Main {
  providers: ProvidersRegistry;
  grammarScopes: Array<string>;

  constructor() {
    this.providers = new ProvidersRegistry()
    this.grammarScopes = ['*']
  }
  addProvider(provider: Provider) {
    if (atom.inDevMode()) {
      validate(provider)
    }
    this.providers.addProvider(provider)
  }
  deleteProvider(provider: Provider) {
    this.providers.deleteProvider(provider)
  }
  async getIntentions({textEditor, visibleRange}: {textEditor: TextEditor, visibleRange: Range}): Promise<Array<Intention>> {
    const results = await this.providers.trigger({textEditor, visibleRange})
    console.log('declarations', results)
    return []
  }
}
