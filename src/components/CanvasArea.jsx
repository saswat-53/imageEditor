import { useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { Rectangle, ImageElement } from './ShapeElement';
import { selectItem, clearSelection, updateItem } from '../redux/canvasSlice';

const CanvasArea = () => {
  const dispatch = useDispatch();
  const { items, selectedId } = useSelector((state) => state.canvas);
  const stageRef = useRef();
  const stageSize = { width: 1200, height: 650 };

  // Check if click is on empty space
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      dispatch(clearSelection());
    }
  };

  // Keep shapes within canvas boundaries
  const handleDragMove = (e) => {
    const shape = e.target;
    const box = shape.getClientRect();
    const absPos = shape.getAbsolutePosition();
    
    const leftEdge = absPos.x;
    const rightEdge = absPos.x + box.width;
    const topEdge = absPos.y;
    const bottomEdge = absPos.y + box.height;
    
    // Constrain to canvas boundaries
    if (leftEdge < 0) absPos.x = 0;
    if (rightEdge > stageSize.width) absPos.x = stageSize.width - box.width;
    if (topEdge < 0) absPos.y = 0;
    if (bottomEdge > stageSize.height) absPos.y = stageSize.height - box.height;
    
    shape.setAbsolutePosition(absPos);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gray-100">
      <div className="relative">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            ref={stageRef}
          >
            <Layer>
              {items.map((item) => {
                if (item.type === 'rectangle') {
                  return (
                    <Rectangle
                      key={item.id}
                      shapeProps={item}
                      isSelected={item.id === selectedId}
                      onSelect={() => dispatch(selectItem(item.id))}
                      onChange={(newAttrs) => {
                        dispatch(updateItem({ id: item.id, ...newAttrs }));
                      }}
                      onDragMove={handleDragMove}
                    />
                  );
                } else if (item.type === 'image') {
                  return (
                    <ImageElement
                      key={item.id}
                      shapeProps={item}
                      isSelected={item.id === selectedId}
                      onSelect={() => dispatch(selectItem(item.id))}
                      onChange={(newAttrs) => {
                        dispatch(updateItem({ id: item.id, ...newAttrs }));
                      }}
                      onDragMove={handleDragMove}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </div>
        
        {/* Canvas Info */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
          Canvas: {stageSize.width} x {stageSize.height}px | Elements: {items.length}
        </div>
      </div>
    </div>
  );
};

export default CanvasArea;