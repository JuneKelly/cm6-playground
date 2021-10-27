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
  insertChar(position, ch) {
    if (position < 0) {
      position = view.state.doc.length + position
    }
    if (position == -0) {
      position = view.state.doc.length
    }
    const transaction = view.state.update({
      changes: { from: position, insert: ch }
    })
    console.log(">> insertChar, transaction: ", transaction)
    view.dispatch(transaction)
  },
  prependChar(ch) {
    this.insertChar(0, ch)
  },
  appendChar(ch) {
    this.insertChar(-0, ch)
  }
}

console.log(">> Init")
