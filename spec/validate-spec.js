'use babel'

import {validateDeclarations, validateProvider} from '../lib/validate'

describe('Validate', function() {

  describe('validateDeclarations', function() {
    it('works well with valid ones', function() {
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: [0, 1]
          }
        }])
      }).not.toThrow()
    })
    it('cries if range is invalid', function() {
      expect(function() {
        validateDeclarations([{
          range: false,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1]
          }
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: null,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1]
          }
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: true,
          source: {
            filePath: '/etc/passwd',
            position: [0, 1]
          }
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: 'asd',
          source: {
            filePath: '/etc/passwd',
            position: [0, 1]
          }
        }])
      }).toThrow()
    })
    it('cries if source is invalid', function() {
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: null
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: false
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: true
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: 'asd'
        }])
      }).toThrow()
    })
    it('cries if source.filePath is invalid', function() {
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: false,
            position: [0, 1]
          }
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: null,
            position: [0, 1]
          }
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: true,
            position: [0, 1]
          }
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: {},
            position: [0, 1]
          }
        }])
      }).toThrow()
    })
    it('ignores if theres no source.position', function() {
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: null
          }
        }])
      }).not.toThrow()
    })
    it('cries if source.position is provided an invalid', function() {
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: true
          }
        }])
      }).toThrow()
      expect(function() {
        validateDeclarations([{
          range: [[0, 0], [0, 1]],
          source: {
            filePath: '/etc/passwd',
            position: 'asd'
          }
        }])
      }).toThrow()
    })
  })

})
