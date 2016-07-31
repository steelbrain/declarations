'use babel'

import { processDeclarations, processProvider } from '../lib/process'

describe('Process', function() {
  afterEach(function() {
    atom.notifications.clear()
  })

  function testResultOf(callback: Function) {
    callback()
    return expect(atom.notifications.getNotifications().length === 0)
  }

  describe('processDeclarations', function() {
    it('works well with valid ones', function() {
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toBe(true)
    })
    it('cries if range is invalid', function() {
      testResultOf(function() {
        processDeclarations([{
          range: false,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: null,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: true,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: 'asd',
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toBe(false)
    })
    it('cries if source is invalid', function() {
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: null,
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: false,
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: true,
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: 'asd',
        }])
      }).toBe(false)
    })
    it('cries if source.filePath is invalid', function() {
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: false,
            position: [0, 1],
          },
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: null,
            position: [0, 1],
          },
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: true,
            position: [0, 1],
          },
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: {},
            position: [0, 1],
          },
        }])
      }).toBe(false)
    })
    it('ignores if theres no source.position', function() {
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: null,
          },
        }])
      }).toBe(true)
    })
    it('cries if source.position is provided an invalid', function() {
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: true,
          },
        }])
      }).toBe(false)
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: 'asd',
          },
        }])
      }).toBe(false)
    })
    it('accepts callback in source', function() {
      testResultOf(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source() {},
        }])
      }).toBe(true)
    })
    it('normalizes contents of declarations', function() {
      const declaration = {
        range: [[0, 0], [1, 1]],
        source: {
          filePath: '/etc/passwd',
          position: [0, 1],
        },
      }
      processDeclarations([declaration])
      expect(declaration.range.constructor.name).toBe('Range')
      expect(declaration.source.position.constructor.name).toBe('Point')
    })
  })

  describe('validateProvider', function() {
    it('works with valid providers', function() {
      testResultOf(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations() { },
        })
      }).toBe(true)
    })
    it('cries if grammarScopes is invalid', function() {
      testResultOf(function() {
        processProvider({
          grammarScopes: null,
          getDeclarations() {},
        })
      }).toBe(false)
      testResultOf(function() {
        processProvider({
          grammarScopes: true,
          getDeclarations() {},
        })
      }).toBe(false)
      testResultOf(function() {
        processProvider({
          grammarScopes: 'asd',
          getDeclarations() {},
        })
      }).toBe(false)
      testResultOf(function() {
        processProvider({
          grammarScopes: {},
          getDeclarations() {},
        })
      }).toBe(false)
    })
    it('cries if getDeclarations is invalid', function() {
      testResultOf(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: true,
        })
      }).toBe(false)
      testResultOf(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: false,
        })
      }).toBe(false)
      testResultOf(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: null,
        })
      }).toBe(false)
      testResultOf(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: 'asd',
        })
      }).toBe(false)
      testResultOf(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: {},
        })
      }).toBe(false)
    })
  })
})
