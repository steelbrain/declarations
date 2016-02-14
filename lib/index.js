'use babel'

/* @flow */

import {Main} from './main'

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
  consumeProvider(provider) {
    console.log(provider)
  }
}
