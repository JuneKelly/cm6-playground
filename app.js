import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { keymap, Decoration, DecorationSet } from "@codemirror/view"
import { StateField, StateEffect } from "@codemirror/state"

// Underline command
const addUnderline = StateEffect.define()

const underlineField = StateField.define({
  create() {
    return Decoration.none
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes)
    for (let e of tr.effects) if (e.is(addUnderline)) {
      underlines = underlines.update({
        add: [underlineMark.range(e.value.from, e.value.to)]
      })
    }
    return underlines
  },
  provide: f => EditorView.decorations.from(f)
})

const underlineMark = Decoration.mark({class: "cm-underline"})

const underlineTheme = EditorView.baseTheme({
  ".cm-underline": { textDecoration: "underline 3px red" }
})

export function underlineSelection(view) {
  console.log(">>>> underline selection")
  let effects = view.state.selection.ranges
    .filter(r => !r.empty)
    .map(({from, to}) => addUnderline.of({from, to}))
  console.log("  - effects: ", effects)
  if (!effects.length) return false

  if (!view.state.field(underlineField, false))
    effects.push(StateEffect.appendConfig.of([underlineField,
                                              underlineTheme]))
  view.dispatch({effects})
  return true
}

export const underlineKeymap = keymap.of([{
  key: "Mod-h",
  preventDefault: true,
  run: underlineSelection
}])

// Setup
let startState = EditorState.create({
  doc: "Hello World",
  extensions: [basicSetup, underlineKeymap]
})

let view = new EditorView({
  state: startState,
  parent: document.querySelector('#editor')
})

window.__cm6 = {
  EditorState,
  startState,
  view,
  insertText(position, ch) {
    if (position < 0) {
      position = this.view.state.doc.length + position
    } else if (position === 'end') {
      position = this.view.state.doc.length
    } else if (position === 'start') {
      position = 0
    }
    const transaction = this.view.state.update({
      changes: { from: position, insert: ch }
    })
    console.log(">> insertChar, transaction: ", transaction)
    this.view.dispatch(transaction)
  },
  prependText(ch) {
    this.insertText(0, ch)
  },
  appendText(ch) {
    this.insertText('end', ch)
  }
}

console.log(">> Init")
