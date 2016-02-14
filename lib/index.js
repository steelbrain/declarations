'use babel'

/* @flow */

import {Disposable} from 'atom'
import {Main} from './main'
import type {ProviderHighlight} from './provider-highlight'
import type {ProviderList} from './provider-list'
import type {Provider} from './types'

module.exports = {
  config: {

  },
  activate() {
    this.instance = new Main()
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
    providers.forEach(provider => {
      this.instance.addProvider(provider)
    })
    return new Disposable(() => {
      providers.forEach(provider => {
        this.instance.deleteProvider(provider)
      })
    })
  }
}
