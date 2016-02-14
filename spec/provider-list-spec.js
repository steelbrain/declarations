'use babel'

import {Point} from 'atom'
import {ProviderList} from '../lib/provider-list'
import {waitsForAsync} from './helpers'

describe('ProviderList', function() {
  let editor
  let providerList
  let providerParams

  beforeEach(function() {
    if (providerList) {
      providerList.dispose()
    }
    providerList = new ProviderList()
    atom.packages.activatePackage('language-javascript')
    atom.workspace.destroyActivePane()
    waitsForPromise(function() {
      return atom.workspace.open(__filename).then(function() {
        editor = atom.workspace.getActiveTextEditor()
        providerParams = {textEditor: editor, bufferPosition: Point.fromObject([1, 2])}
      })
    })
  })

    it('works', function() {
      let requestIntentionsCalled = false
      providerList.onShouldProvideDeclarations(function(e) {
        expect(e.parameters.visibleRange).toEqual([[1, 0], [1, Infinity]])
        if (requestIntentionsCalled) {
          return
        }
        requestIntentionsCalled = true
        e.promise = Promise.resolve([{
          range: [[1, 1], [1, Infinity]]
        }])
      })

      waitsForAsync(async function() {
        let results
        results = await providerList.getIntentions(providerParams)
        expect(results).toEqual([{
          priority: 100,
          icon: 'alignment-align',
          title: 'Jump to declaration',
          selected: results[0].selected
        }])
        expect(requestIntentionsCalled).toBe(true)
        results = await providerList.getIntentions(providerParams)
        expect(results).toEqual([])
      })
    })
})
