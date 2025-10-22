import { createSlice } from '@reduxjs/toolkit';

// Helper function to generate random colors
const getRandomColor = () => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const initialState = {
  items: [],
  selectedId: null,
  history: [],
  historyIndex: -1,
  nextId: 1
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    addRectangle: (state) => {
      const newRect = {
        id: `rect_${state.nextId}`,
        type: 'rectangle',
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
        width: 100,
        height: 80,
        fill: getRandomColor(),
        rotation: 0
      };
      
      state.items.push(newRect);
      state.selectedId = newRect.id;
      state.nextId++;
      
      // Add to history for undo/redo
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(JSON.parse(JSON.stringify(state.items)));
      state.historyIndex++;
    },
    
    addImage: (state, action) => {
      const newImage = {
        id: `img_${state.nextId}`,
        type: 'image',
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
        width: 150,
        height: 100,
        src: action.payload,
        rotation: 0
      };
      
      state.items.push(newImage);
      state.selectedId = newImage.id;
      state.nextId++;
      
      // Add to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(JSON.parse(JSON.stringify(state.items)));
      state.historyIndex++;
    },
    
    updateItem: (state, action) => {
      const { id, ...updates } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        state.items[itemIndex] = { ...state.items[itemIndex], ...updates };
      }
    },
    
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
      
      // Add to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(JSON.parse(JSON.stringify(state.items)));
      state.historyIndex++;
    },
    
    selectItem: (state, action) => {
      state.selectedId = action.payload;
    },
    
    clearSelection: (state) => {
      state.selectedId = null;
    },
    
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        state.items = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedId = null;
      }
    },
    
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.items = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedId = null;
      }
    },
    
    saveToStorage: (state) => {
      const dataToSave = {
        items: state.items,
        nextId: state.nextId
      };
      localStorage.setItem('canvasEditorState', JSON.stringify(dataToSave));
    },
    
    loadFromStorage: (state) => {
      const saved = localStorage.getItem('canvasEditorState');
      if (saved) {
        const data = JSON.parse(saved);
        state.items = data.items || [];
        state.nextId = data.nextId || state.items.length + 1;
        state.selectedId = null;
        state.history = [JSON.parse(JSON.stringify(state.items))];
        state.historyIndex = 0;
      }
    },
    
    initializeHistory: (state) => {
      if (state.history.length === 0) {
        state.history = [[]];
        state.historyIndex = 0;
      }
    }
  }
});

export const {
  addRectangle,
  addImage,
  updateItem,
  deleteItem,
  selectItem,
  clearSelection,
  undo,
  redo,
  saveToStorage,
  loadFromStorage,
  initializeHistory
} = canvasSlice.actions;

export default canvasSlice.reducer;