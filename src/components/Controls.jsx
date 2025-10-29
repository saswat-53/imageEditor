import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addRectangle,
  addImage,
  deleteItem,
  undo,
  redo,
  saveToStorage,
  loadFromStorage
} from '../redux/canvasSlice';

const Controls = () => {
  const dispatch = useDispatch();
  const { selectedId, historyIndex, history } = useSelector((state) => state.canvas);
  const fileInputRef = useRef();

  // Sample images for demo
  const sampleImages = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRhNWY3ZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2FtcGxlIDEgPC90ZXh0Pjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJlY2M3MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2FtcGxlIDI8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y2NmQ5YiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2FtcGxlIDM8L3RleHQ+PC9zdmc+'
  ];

  const handleAddRectangle = () => {
    dispatch(addRectangle());
  };

  const handleAddSampleImage = () => {
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    dispatch(addImage(randomImage));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(addImage(event.target.result));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDelete = () => {
    if (selectedId) {
      dispatch(deleteItem(selectedId));
    }
  };

  const handleSave = () => {
    dispatch(saveToStorage());
    alert('Canvas saved successfully!');
  };

  const handleLoad = () => {
    dispatch(loadFromStorage());
    const saved = localStorage.getItem('canvasEditorState');
    if (saved) {
      alert('Canvas loaded successfully!');
    } else {
      alert('No saved canvas found!');
    }
  };

    // Clear localStorage and reset the application
  const handleClearStorage = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This will remove everything from localStorage and cannot be undone.')) {
      // Clear localStorage
      localStorage.removeItem('canvasEditorState');
      
      // Reload the page to reset the application state
      window.location.reload();
      
      alert('All saved data has been cleared! The page will now reload.');
    }
  };

  return (
    <div className="bg-primary-600 p-3 md:p-4 shadow-lg">
      <div className="flex items-center gap-2 md:gap-4 flex-wrap">
        {/* Title */}
        <h1 className="text-white text-lg md:text-2xl font-bold flex items-center gap-2 mr-auto">
          <span>🎨</span>
          <span className="hidden sm:inline">Canvas Editor</span>
          <span className="sm:hidden">Canvas</span>
        </h1>

        {/* Add Rectangle Button */}
        <button
          onClick={handleAddRectangle}
          className="bg-white text-primary-600 px-3 md:px-4 py-2 rounded-lg font-semibold
                   hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5
                   shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 text-sm md:text-base"
        >
          <span>➕</span>
          <span className="hidden sm:inline">Add Rectangle</span>
          <span className="sm:hidden">Rect</span>
        </button>

        {/* Add Sample Image Button */}
        <button
          onClick={handleAddSampleImage}
          className="bg-white text-primary-600 px-3 md:px-4 py-2 rounded-lg font-semibold
                   hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5
                   shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 text-sm md:text-base"
        >
          <span>🖼️</span>
          <span className="hidden md:inline">Add Sample Image</span>
          <span className="md:hidden">Sample</span>
        </button>

        {/* Upload Image Button */}
        <label className="bg-white text-primary-600 px-3 md:px-4 py-2 rounded-lg font-semibold
                        hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5
                        shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 cursor-pointer text-sm md:text-base">
          <span>📤</span>
          <span className="hidden md:inline">Upload Image</span>
          <span className="md:hidden">Upload</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </label>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={!selectedId}
          className={`px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-200
                     shadow-md flex items-center gap-1 md:gap-2 text-sm md:text-base
                     ${selectedId
                       ? 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg'
                       : 'bg-red-300 text-white cursor-not-allowed'}`}
        >
          <span>🗑️</span>
          <span className="hidden sm:inline">Delete</span>
        </button>

        {/* History Controls */}
        <div className="flex gap-1 md:gap-2 px-1 md:px-2 border-l-2 border-white/30">
          <button
            onClick={() => dispatch(undo())}
            disabled={historyIndex <= 0}
            className={`px-2 md:px-3 py-2 rounded-lg font-semibold transition-all duration-200
                       shadow-md text-lg md:text-xl ${historyIndex > 0
                         ? 'bg-white/20 text-white hover:bg-white/30 hover:-translate-y-0.5'
                         : 'bg-white/10 text-white/50 cursor-not-allowed'}`}
            title="Undo"
          >
            ↶
          </button>
          <button
            onClick={() => dispatch(redo())}
            disabled={historyIndex >= history.length - 1}
            className={`px-2 md:px-3 py-2 rounded-lg font-semibold transition-all duration-200
                       shadow-md text-lg md:text-xl ${historyIndex < history.length - 1
                         ? 'bg-white/20 text-white hover:bg-white/30 hover:-translate-y-0.5'
                         : 'bg-white/10 text-white/50 cursor-not-allowed'}`}
            title="Redo"
          >
            ↷
          </button>
        </div>

        {/* Save/Load Controls */}
        <button
          onClick={handleSave}
          className="bg-white/20 text-white px-3 md:px-4 py-2 rounded-lg font-semibold
                   hover:bg-white/30 transition-all duration-200 hover:-translate-y-0.5
                   shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 border-2 border-white text-sm md:text-base"
        >
          <span>💾</span>
          <span className="hidden sm:inline">Save</span>
        </button>

        <button
          onClick={handleLoad}
          className="bg-white/20 text-white px-3 md:px-4 py-2 rounded-lg font-semibold
                   hover:bg-white/30 transition-all duration-200 hover:-translate-y-0.5
                   shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 border-2 border-white text-sm md:text-base"
        >
          <span>📂</span>
          <span className="hidden sm:inline">Load</span>
        </button>

        {/* Clear Storage Button */}
        <button
          onClick={handleClearStorage}
          className="bg-orange-500 text-white px-3 md:px-4 py-2 rounded-lg font-semibold
                   hover:bg-orange-600 transition-all duration-200 hover:-translate-y-0.5
                   shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 border-2 border-orange-300 text-sm md:text-base"
          title="Clear all saved data from localStorage"
        >
          <span>🧹</span>
          <span className="hidden lg:inline">Clear Storage</span>
          <span className="lg:hidden">Clear</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;