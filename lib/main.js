'use babel'

export class Main {
  constructor() {
    this.grammarScopes = ['*']
  }
  async getIntentions({textEditor, visibleRange}) {
    console.log('get intentions')
    return []
  }
}
