import { reactive } from "vue";

export default class HistoryManager {
    constructor() {
        this.state = reactive({
            undoStack: [],
            redoStack: []
        });
    }

    saveState(ref, state) {
        this.state.undoStack.push({ ref, state });
        this.state.redoStack = []; // Clear redo stack on new change
    }

    undo() {
        if (this.state.undoStack.length > 0) {
            const { ref, state } = this.state.undoStack.pop();
            this.state.redoStack.push({ ref, state });
            ref.undo(state);
        }
    }

    redo() {
        if (this.state.redoStack.length > 0) {
            const { ref, state } = this.state.redoStack.pop();
            this.state.undoStack.push({ ref, state });
            ref.redo(state);
        }
    }

    get hasUndo () { return this.state.undoStack.length > 0 };
    get hasRedo () { return this.state.redoStack.length > 0 };
}
