/* @flow */

import type { Point, TextEditorMarker, TextEditor, Range } from 'atom'

export type Source = {
  filePath: string,
  position: Point,
}

export type Declaration = {
  range: Range,
  source: Source | (() => Source | Promise<Source>),
}

export type Provider = {
  grammarScopes: Array<string>,
  getDeclarations: ((params: {textEditor: TextEditor, visibleRange: Range}) => Array<Declaration>),
}

export type IntentionHighlight = {
  range: Range,
  created(params: {textEditor: TextEditor, element: HTMLElement, marker: TextEditorMarker, matchedText: string}): void,
}

export type IntentionList = {
  priority: number,
  icon: string,
  class?: ?string,
  title: string,
  selected: ?Function
}
