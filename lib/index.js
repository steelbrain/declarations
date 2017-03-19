/* @flow */

import { Disposable } from 'atom'
import Declarations from './main'
import type ProviderHighlight from './provider-highlight'
import type ProviderList from './provider-list'
import type { Provider } from './types'

export default {
  activate() {
    this.instance = new Declarations()
  },
  deactivate() {
    this.instance.dispose()
  },
  provideIntentionsHighlight(): ProviderHighlight {
    return this.instance.provideHighlight()
  },
  provideIntentionsList(): ProviderList {
    return this.instance.provideList()
  },
  consumeProvider(provider: Provider): Disposable {
    const providers = [].concat(provider)
    providers.forEach((entry) => {
      this.instance.addProvider(entry)
    })
    return new Disposable(() => {
      providers.forEach((entry) => {
        this.instance.deleteProvider(entry)
      })
    })
  },
}
