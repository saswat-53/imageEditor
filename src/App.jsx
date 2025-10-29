import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Controls from './components/Controls';
import CanvasArea from './components/CanvasArea';
import Sidebar from './components/Sidebar';
import { loadFromStorage, initializeHistory } from './redux/canvasSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Try to load saved state on mount
    dispatch(loadFromStorage());
    
    // Initialize history if empty
    dispatch(initializeHistory());
  }, [dispatch]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Controls Bar */}
      <Controls />

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Canvas Area */}
        <CanvasArea />

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}

export default App;