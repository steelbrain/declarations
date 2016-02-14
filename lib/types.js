'use babel'

/* @flow */

import type {TextEditorMarker, TextEditor, Range} from 'atom'

export type Provider = {

}

export type Intention = {
  range: Range,
  created(params: {textEditor: TextEditor, element: HTMLElement, marker: TextEditorMarker, matchedText: string}): void
}
