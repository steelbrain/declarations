'use babel'

/* @flow */

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
    console.log(provider)
  }
}
