import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DropResult } from '@hello-pangea/dnd';

export interface Component {
  id: string;
  type: string;
  contentId: string; // To link to a Contentful entry
}

interface LayoutState {
  components: Component[];
  history: {
    past: Component[][];
    present: Component[];
    future: Component[][];
  };
}

const initialState: LayoutState = {
  components: [],
  history: {
    past: [],
    present: [],
    future: [],
  },
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<Component>) => {
      state.components.push(action.payload);
    },
    reorderComponents: (state, action: PayloadAction<DropResult>) => {
      const { source, destination } = action.payload;
      if (!destination) {
        return;
      }

      const [reorderedItem] = state.components.splice(source.index, 1);
      state.components.splice(destination.index, 0, reorderedItem);
    },
    setInitialState: (state, action: PayloadAction<Component[]>) => {
      state.components = action.payload;
      state.history.present = action.payload;
    },
    undo: (state) => {
        if (state.history.past.length > 0) {
            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, state.history.past.length - 1);
            const newFuture = [state.history.present, ...state.history.future];
            state.history.past = newPast;
            state.history.present = previous;
            state.history.future = newFuture;
            state.components = previous;
        }
    },
    redo: (state) => {
        if (state.history.future.length > 0) {
            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);
            const newPast = [...state.history.past, state.history.present];
            state.history.past = newPast;
            state.history.present = next;
            state.history.future = newFuture;
            state.components = next;
        }
    },
    // Middleware will handle pushing to history
    updateHistory: (state) => {
        const newPast = [...state.history.past, state.history.present];
        state.history.past = newPast;
        state.history.present = state.components;
        state.history.future = [];
    }
  },
});

export const { addComponent, reorderComponents, setInitialState, undo, redo, updateHistory } = layoutSlice.actions;

export default layoutSlice.reducer; 