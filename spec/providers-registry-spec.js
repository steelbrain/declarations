'use babel'

import { Range } from 'atom'
import ProvidersRegistry from '../lib/providers-registry'

describe('ProvidersRegistry', function() {
  let editor
  let providerParams
  let providersRegistry

  beforeEach(function() {
    if (providersRegistry) {
      providersRegistry.dispose()
    }
    providersRegistry = new ProvidersRegistry()
    atom.packages.activatePackage('language-javascript')
    atom.workspace.destroyActivePane()
    waitsForPromise(function() {
      return atom.workspace.open(__filename).then(function() {
        editor = atom.workspace.getActiveTextEditor()
        providerParams = { textEditor: editor, visibleRange: Range.fromObject([[0, 0], [1, 0]]) }
      })
    })
  })

  describe('addProvider & hasProvider', function() {
    it('works properly', function() {
      const provider = {
        grammarScopes: [],
        getDeclarations() {},
      }
      expect(providersRegistry.hasProvider(provider)).toBe(false)
      providersRegistry.addProvider(provider)
      expect(providersRegistry.hasProvider(provider)).toBe(true)
    })
  })
  describe('deleteProvider', function() {
    it('works properly', function() {
      providersRegistry.deleteProvider(true)
      providersRegistry.deleteProvider(null)
      providersRegistry.deleteProvider(false)
      providersRegistry.deleteProvider(50)
      const provider = {
        grammarScopes: [],
        getDeclarations() {},
      }
      expect(providersRegistry.hasProvider(provider)).toBe(false)
      providersRegistry.addProvider(provider)
      expect(providersRegistry.hasProvider(provider)).toBe(true)
      providersRegistry.deleteProvider(provider)
      expect(providersRegistry.hasProvider(provider)).toBe(false)
    })
  })
  describe('trigger', function() {
    it('works properly', function() {
      const intention = {
        range: [[0, 1], [1, Infinity]],
        source: {
          filePath: '',
        },
      }
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          return [intention]
        },
      })
      waitsForPromise(function() {
        return providersRegistry.trigger(providerParams).then(function(results) {
          expect(results).not.toBe(null)
          expect(results instanceof Array).toBe(true)
          expect(results[0]).toBe(intention)
        })
      })
    })
    it('ignores previous result from executed twice instantly', function() {
      let count = 0
      const intentionFirst = {
        range: [[0, 1], [1, Infinity]],
        source: {
          filePath: '',
        },
      }
      const intentionSecond = {
        range: [[0, 1], [1, Infinity]],
        source: {
          filePath: '',
        },
      }
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          if (++count === 1) {
            return [intentionFirst]
          }
          return [intentionSecond]
        },
      })
      const promiseFirst = providersRegistry.trigger(providerParams)
      const promiseSecond = providersRegistry.trigger(providerParams)

      waitsForPromise(function() {
        return promiseFirst.then(function(results) {
          expect(results).toBe(null)
        })
      })
      waitsForPromise(function() {
        return promiseSecond.then(function(results) {
          expect(results).not.toBe(null)
          expect(results instanceof Array).toBe(true)
          expect(results[0]).toBe(intentionSecond)
        })
      })
    })
    it('does not enable it if providers return no results, including non-array ones', function() {
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          return []
        },
      })
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          return null
        },
      })
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          return false
        },
      })
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          return 50
        },
      })
      waitsForPromise(function() {
        return providersRegistry.trigger(providerParams).then(function(results) {
          expect(results).toBe(null)
        })
      })
    })
    it('emits an error if provider throws an error', function() {
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          throw new Error('test from provider')
        },
      })
      waitsForPromise(function() {
        return providersRegistry.trigger(providerParams).then(function() {
          expect(false).toBe(true)
        }, function(e) {
          expect(e.message).toBe('test from provider')
        })
      })
    })
    it('validates suggestions properly', function() {
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          return [{}]
        },
      })
      waitsForPromise(function() {
        return providersRegistry.trigger(providerParams).then(function() {
          expect(false).toBe(true)
        }, function(e) {
          expect(e instanceof Error).toBe(true)
        })
      })
    })
    it('triggers providers based on scope', function() {
      let coffeeCalled = false
      let jsCalled = false
      providersRegistry.addProvider({
        grammarScopes: ['source.js'],
        getDeclarations() {
          jsCalled = true
        },
      })
      providersRegistry.addProvider({
        grammarScopes: ['source.coffee'],
        getDeclarations() {
          coffeeCalled = true
        },
      })
      waitsForPromise(function() {
        return providersRegistry.trigger(providerParams).then(function() {
          expect(jsCalled).toBe(true)
          expect(coffeeCalled).toBe(false)
        })
      })
    })
  })
})
