'use babel'

/* @flow */

import type {TextEditorMarker, TextEditor, Range} from 'atom'

export type Provider = {
  grammarScopes: Array<string>,
  getDeclarations: ((params: {textEditor: TextEditor, visibleRange: Range}) => Array<Declaration>)
}

export type Intention = {
  range: Range,
  created(params: {textEditor: TextEditor, element: HTMLElement, marker: TextEditorMarker, matchedText: string}): void
}

export type Declaration = {

}
