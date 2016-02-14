'use babel'

/* @flow */

import {CompositeDisposable} from 'atom'
import {ProvidersRegistry} from './providers-registry'
import {ProviderList} from './provider-list'
import {ProviderHighlight} from './provider-highlight'
import {validateProvider as validate} from './validate'
import type {TextEditor, Range} from 'atom'
import type {Provider} from './types'

export class Main {
  providers: ProvidersRegistry;
  subscriptions: CompositeDisposable;

  constructor() {
    this.providers = new ProvidersRegistry()
    this.subscriptions = new CompositeDisposable()
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
  provideHighlight(): ProviderHighlight {
    const highlight = new ProviderHighlight()
    highlight.onShouldProvideDeclarations(e => {
      e.promise = this.providers.trigger(e.parameters)
    })
    this.subscriptions.add(highlight)
    return highlight
  }
  provideList(): ProviderList {
    const list = new ProviderList()
    list.onShouldProvideDeclarations(e => {
      e.promise = this.providers.trigger(e.parameters)
    })
    this.subscriptions.add(list)
    return list
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
