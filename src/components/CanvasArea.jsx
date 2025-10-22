import { useRef, useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { Rectangle, ImageElement } from './ShapeElement';
import { selectItem, clearSelection, updateItem } from '../redux/canvasSlice';

const CanvasArea = () => {
  const dispatch = useDispatch();
  const { items, selectedId } = useSelector((state) => state.canvas);
  const stageRef = useRef();
  const containerRef = useRef();
  const [stageSize, setStageSize] = useState({ width: 1200, height: 650 });
  const [scale, setScale] = useState(1);

  // Update canvas size based on viewport
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const padding = window.innerWidth < 768 ? 16 : 48; // Less padding on mobile
        const availableWidth = container.clientWidth - padding;
        const availableHeight = container.clientHeight - padding;

        const baseWidth = 1200;
        const baseHeight = 650;

        // Calculate scale to fit
        const scaleX = availableWidth / baseWidth;
        const scaleY = availableHeight / baseHeight;
        const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

        setScale(newScale);
        setStageSize({
          width: baseWidth,
          height: baseHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
    <div ref={containerRef} className="flex-1 flex items-center justify-center p-2 md:p-6 bg-gray-100 overflow-auto">
      <div className="relative">
        <div className="bg-white rounded-lg md:rounded-xl shadow-2xl overflow-hidden">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            scaleX={scale}
            scaleY={scale}
            style={{
              width: stageSize.width * scale,
              height: stageSize.height * scale
            }}
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
        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-black/70 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs md:text-sm">
          <span className="hidden sm:inline">Canvas: {stageSize.width} x {stageSize.height}px | </span>
          Elements: {items.length}
          {scale < 1 && <span className="hidden md:inline"> | Scale: {Math.round(scale * 100)}%</span>}
        </div>
      </div>
    </div>
  );
};

export default CanvasArea;