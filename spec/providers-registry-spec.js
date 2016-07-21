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
    waitsForPromise(function() {
      return atom.workspace.open(__filename).then(function() {
        editor = atom.workspace.getActiveTextEditor()
        providerParams = { textEditor: editor, visibleRange: Range.fromObject([[0, 0], [1, 0]]) }
      })
    })
  })
  afterEach(function() {
    atom.workspace.destroyActivePane()
    atom.notifications.clear()
  })

  describe('addProvider', function() {
    it('works properly', function() {
      const provider = {
        grammarScopes: [],
        getDeclarations() {},
      }
      expect(providersRegistry.providers.has(provider)).toBe(false)
      providersRegistry.addProvider(provider)
      expect(providersRegistry.providers.has(provider)).toBe(true)
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
      expect(providersRegistry.providers.has(provider)).toBe(false)
      providersRegistry.addProvider(provider)
      expect(providersRegistry.providers.has(provider)).toBe(true)
      providersRegistry.deleteProvider(provider)
      expect(providersRegistry.providers.has(provider)).toBe(false)
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
    it('emits an error if provider throws an error', function() {
      providersRegistry.addProvider({
        grammarScopes: ['*'],
        getDeclarations() {
          throw new Error('test from provider')
        },
      })
      waitsForPromise(function() {
        return providersRegistry.trigger(providerParams).then(function() {
          expect(atom.notifications.getNotifications().length).toBe(1)
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
          expect(atom.notifications.getNotifications().length).toBe(1)
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
