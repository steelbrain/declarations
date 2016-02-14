'use babel'

/* @flow */

import {validateDeclarations as validate} from './validate'
import {validateProvider as validateProvider} from './validate'
import type {TextEditor} from 'atom'
import type {Provider, Declaration} from './types'

export class ProvidersRegistry {
  number: number;
  providers: Set<Provider>;

  constructor() {
    this.number = 0
    this.providers = new Set()
  }
  addProvider(provider: Provider) {
    if (atom.inDevMode()) {
      validateProvider(provider)
    }
    this.providers.add(provider)
  }
  hasProvider(provider: Provider): boolean {
    return this.providers.has(provider)
  }
  deleteProvider(provider: Provider): void {
    if (this.hasProvider(provider)) {
      this.providers.delete(provider)
    }
  }
  async trigger({textEditor, visibleRange}: {textEditor: TextEditor, visibleRange: Range}): Promise<?Array<Declaration>> {
    const editorPath = textEditor.getPath()
    const bufferPosition = textEditor.getCursorBufferPosition()

    if (!editorPath) {
      return null
    }
    const scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray()
    scopes.push('*')

    const promises = []
    this.providers.forEach(function(provider) {
      if (scopes.some(scope => provider.grammarScopes.indexOf(scope) !== -1)) {
        promises.push(new Promise(function(resolve) {
          resolve(provider.getDeclarations({textEditor, visibleRange}))
        }).then(function(results) {
          if (atom.inDevMode()) {
            validate(results)
          }
          return results
        }))
      }
    })

    const number = ++this.number
    const results = (await Promise.all(promises)).reduce(function(items, item) {
      if (Array.isArray(item)) {
        return items.concat(item)
      } else return items
    }, [])

    if (number !== this.number) {
      // If has been executed one more time, ignore these results
      return null
    } else if (!results.length) {
      // We got nothing here
      return null
    }

    return results
  }
  dispose() {
    this.providers.clear()
  }
}
