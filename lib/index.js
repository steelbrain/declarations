'use babel'

/* @flow */

import {Disposable} from 'atom'
import {Main} from './main'
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
  provideIntentions(): Main {
    return this.instance
  },
  consumeProvider(provider: Provider) {
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
