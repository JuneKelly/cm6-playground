import {EditorState} from "@codemirror/state"
import {EditorView, keymap} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"

let startState = EditorState.create({
  doc: "Hello World",
  extensions: [keymap.of(defaultKeymap)]
})

let view = new EditorView({
  state: startState,
  parent: document.querySelector('#editor')
})

window.__cm6 = {
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
