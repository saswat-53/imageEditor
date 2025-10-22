import { useSelector, useDispatch } from 'react-redux';
import { selectItem, deleteItem } from '../redux/canvasSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { items, selectedId } = useSelector((state) => state.canvas);

  const handleItemClick = (id) => {
    dispatch(selectItem(id));
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    dispatch(deleteItem(id));
  };

  const formatPosition = (x, y) => {
    return `${Math.round(x)}, ${Math.round(y)}`;
  };

  const formatDimensions = (width, height) => {
    return `${Math.round(width)} × ${Math.round(height)}`;
  };

  const getItemIcon = (type) => {
    return type === 'rectangle' ? '⬛' : '🖼️';
  };

  const getItemTypeName = (type) => {
    return type === 'rectangle' ? 'Rectangle' : 'Image';
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 bg-linear-to-r from-primary-50 to-primary-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>📋</span>
          Elements Overview
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {items.length} element{items.length !== 1 ? 's' : ''} on canvas
        </p>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-lg font-medium mb-2">No elements yet</p>
            <p className="text-sm">Add rectangles or images to see them here</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                  selectedId === item.id
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                {/* Item Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl ${selectedId === item.id ? 'text-primary-600' : 'text-gray-600'}`}>
                      {getItemIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {getItemTypeName(item.type)} {item.id.split('_')[1]}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteClick(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                             w-6 h-6 flex items-center justify-center rounded-full 
                             bg-red-500 text-white text-xs hover:bg-red-600
                             focus:opacity-100 focus:outline-none"
                    title="Delete element"
                  >
                    ×
                  </button>
                </div>

                {/* Item Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 block text-xs font-medium mb-1">Position</span>
                    <span className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {formatPosition(item.x, item.y)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 block text-xs font-medium mb-1">Size</span>
                    <span className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {formatDimensions(item.width, item.height)}
                    </span>
                  </div>

                  {item.type === 'rectangle' && (
                    <div className="col-span-2">
                      <span className="text-gray-600 block text-xs font-medium mb-1">Color</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-gray-800 font-mono text-xs">
                          {item.fill.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  {item.type === 'image' && (
                    <div className="col-span-2">
                      <span className="text-gray-600 block text-xs font-medium mb-1">Source</span>
                      <span className="text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded truncate block">
                        {item.src.startsWith('data:image/svg') ? 'Sample Image' : 'Uploaded Image'}
                      </span>
                    </div>
                  )}

                  {item.rotation !== 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-600 block text-xs font-medium mb-1">Rotation</span>
                      <span className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        {Math.round(item.rotation)}°
                      </span>
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedId === item.id && (
                  <div className="mt-3 pt-3 border-t border-primary-200">
                    <div className="flex items-center gap-2 text-primary-600 text-xs">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                      <span>Currently selected</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Total elements:</span>
            <span className="font-semibold">{items.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected:</span>
            <span className="font-semibold">
              {selectedId ? `#${selectedId.split('_')[1]}` : 'None'}
            </span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-3 flex gap-2">
          {selectedId && (
            <button
              onClick={() => dispatch(deleteItem(selectedId))}
              className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-xs font-medium 
                       hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <span>🗑️</span>
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;