'use babel'

/* @flow */

import type {Point, TextEditorMarker, TextEditor, Range} from 'atom'

export type Provider = {
  grammarScopes: Array<string>,
  getDeclarations: ((params: {textEditor: TextEditor, visibleRange: Range}) => Array<Declaration>)
}

export type Declaration = {
  range: Range,
  source: {
    filePath: string,
    position: Point
  }
}

export type Intention$Highlight = {
  range: Range,
  created(params: {textEditor: TextEditor, element: HTMLElement, marker: TextEditorMarker, matchedText: string}): void
}

export type Intention$List = {
  priority: number,
  icon: string,
  class?: ?string,
  title: string,
  selected: ?Function
}
