/* @flow */

import { CompositeDisposable } from 'atom'
import ProvidersRegistry from './providers-registry'
import ProviderList from './provider-list'
import ProviderHighlight from './provider-highlight'
import type { Provider } from './types'

export default class Declarations {
  providers: ProvidersRegistry;
  subscriptions: CompositeDisposable;

  constructor() {
    this.providers = new ProvidersRegistry()
    this.subscriptions = new CompositeDisposable()
  }
  addProvider(provider: Provider) {
    this.providers.addProvider(provider)
  }
  deleteProvider(provider: Provider) {
    this.providers.deleteProvider(provider)
  }
  provideHighlight(): ProviderHighlight {
    const highlight = new ProviderHighlight()
    // eslint-disable-next-line arrow-parens
    highlight.onShouldProvideDeclarations(async (e) => {
      e.result = await this.providers.trigger(e.parameters)
    })
    this.subscriptions.add(highlight)
    return highlight
  }
  provideList(): ProviderList {
    const list = new ProviderList()
    // eslint-disable-next-line arrow-parens
    list.onShouldProvideDeclarations(async (e) => {
      e.result = await this.providers.trigger(e.parameters)
    })
    this.subscriptions.add(list)
    return list
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
