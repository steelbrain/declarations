'use babel'

import { processDeclarations, processProvider } from '../lib/process'

describe('Process', function() {
  describe('processDeclarations', function() {
    it('works well with valid ones', function() {
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).not.toThrow()
    })
    it('cries if range is invalid', function() {
      expect(function() {
        processDeclarations([{
          range: false,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: null,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: true,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: 'asd',
          source: {
            filePath: '/etc/passwd',
            position: [0, 1],
          },
        }])
      }).toThrow()
    })
    it('cries if source is invalid', function() {
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: null,
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: false,
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: true,
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: 'asd',
        }])
      }).toThrow()
    })
    it('cries if source.filePath is invalid', function() {
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: false,
            position: [0, 1],
          },
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: null,
            position: [0, 1],
          },
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: true,
            position: [0, 1],
          },
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: {},
            position: [0, 1],
          },
        }])
      }).toThrow()
    })
    it('ignores if theres no source.position', function() {
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: null,
          },
        }])
      }).not.toThrow()
    })
    it('cries if source.position is provided an invalid', function() {
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: true,
          },
        }])
      }).toThrow()
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: 'asd',
          },
        }])
      }).toThrow()
    })
    it('accepts callback in source', function() {
      expect(function() {
        processDeclarations([{
          range: [[0, 0], [0, 1]],
          source() {},
        }])
      }).not.toThrow()
    })
  })

  describe('validateProvider', function() {
    it('works with valid providers', function() {
      expect(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations() { },
        })
      }).not.toThrow()
    })
    it('cries if grammarScopes is invalid', function() {
      expect(function() {
        processProvider({
          grammarScopes: null,
          getDeclarations() {},
        })
      }).toThrow()
      expect(function() {
        processProvider({
          grammarScopes: true,
          getDeclarations() {},
        })
      }).toThrow()
      expect(function() {
        processProvider({
          grammarScopes: 'asd',
          getDeclarations() {},
        })
      }).toThrow()
      expect(function() {
        processProvider({
          grammarScopes: {},
          getDeclarations() {},
        })
      }).toThrow()
    })
    it('cries if getDeclarations is invalid', function() {
      expect(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: true,
        })
      }).toThrow()
      expect(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: false,
        })
      }).toThrow()
      expect(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: null,
        })
      }).toThrow()
      expect(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: 'asd',
        })
      }).toThrow()
      expect(function() {
        processProvider({
          grammarScopes: ['*'],
          getDeclarations: {},
        })
      }).toThrow()
    })
  })
})
