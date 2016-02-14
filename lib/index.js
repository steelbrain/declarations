'use babel'

/* @flow */

module.exports = {
  config: {

  },
  activate() {
    console.log('activate')
  },
  deactivate() {
    console.log('deactivates')
  },
  provideIntentions() {
    return []
  },
  consumeProvider(provider) {
    console.log(provider)
  }
}
