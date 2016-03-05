'use babel'

import {visitSource} from '../lib/helpers'

describe('Helpers', function() {

  beforeEach(function() {
    atom.workspace.destroyActivePaneItem()
  })

  describe('visitSource', function() {
    it('opens the file and sets cursor position', function() {
      const filePath = __filename
      waitsForPromise(function() {
        return visitSource({source: {filePath, position: [0, 1]}}).then(function() {
          const activeEditor = atom.workspace.getActiveTextEditor()
          expect(activeEditor.getPath()).toBe(filePath)
          expect(activeEditor.getCursorBufferPosition()).toEqual([0, 1])
        })
      })
    })

    it('opens the file and does not set cursor position if its not provided', function() {
      const filePath = __filename
      waitsForPromise(function() {
        return visitSource({source: {filePath, position: [0, 0]}}).then(function() {
          const activeEditor = atom.workspace.getActiveTextEditor()
          expect(activeEditor.getPath()).toBe(filePath)
          expect(activeEditor.getCursorBufferPosition()).toEqual([0, 0])
        })
      })
    })
  })

})
