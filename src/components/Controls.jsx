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
    <div className="bg-primary-600 p-4 shadow-lg">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Title */}
        <h1 className="text-white text-2xl font-bold flex items-center gap-2 mr-auto">
          <span>🎨</span>
          Canvas Editor
        </h1>

        {/* Add Rectangle Button */}
        <button
          onClick={handleAddRectangle}
          className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold 
                   hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 
                   shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>➕</span>
          Add Rectangle
        </button>

        {/* Add Sample Image Button */}
        <button
          onClick={handleAddSampleImage}
          className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold 
                   hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 
                   shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>🖼️</span>
          Add Sample Image
        </button>

        {/* Upload Image Button */}
        <label className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold 
                        hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 
                        shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer">
          <span>📤</span>
          Upload Image
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
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 
                     shadow-md flex items-center gap-2
                     ${selectedId 
                       ? 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg' 
                       : 'bg-red-300 text-white cursor-not-allowed'}`}
        >
          <span>🗑️</span>
          Delete
        </button>

        {/* History Controls */}
        <div className="flex gap-2 px-2 border-l-2 border-white/30">
          <button
            onClick={() => dispatch(undo())}
            disabled={historyIndex <= 0}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 
                       shadow-md ${historyIndex > 0
                         ? 'bg-white/20 text-white hover:bg-white/30 hover:-translate-y-0.5'
                         : 'bg-white/10 text-white/50 cursor-not-allowed'}`}
            title="Undo"
          >
            ↶
          </button>
          <button
            onClick={() => dispatch(redo())}
            disabled={historyIndex >= history.length - 1}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 
                       shadow-md ${historyIndex < history.length - 1
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
          className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold 
                   hover:bg-white/30 transition-all duration-200 hover:-translate-y-0.5 
                   shadow-md hover:shadow-lg flex items-center gap-2 border-2 border-white"
        >
          <span>💾</span>
          Save
        </button>
        
        <button
          onClick={handleLoad}
          className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold 
                   hover:bg-white/30 transition-all duration-200 hover:-translate-y-0.5 
                   shadow-md hover:shadow-lg flex items-center gap-2 border-2 border-white"
        >
          <span>📂</span>
          Load
        </button>
        {/* Clear Storage Button */}
        <button
          onClick={handleClearStorage}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold 
                   hover:bg-orange-600 transition-all duration-200 hover:-translate-y-0.5 
                   shadow-md hover:shadow-lg flex items-center gap-2 border-2 border-orange-300"
          title="Clear all saved data from localStorage"
        >
          <span>🧹</span>
          Clear Storage
        </button>
      </div>
    </div>
  );
};

export default Controls;