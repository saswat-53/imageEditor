import { useEffect, useRef, useState } from 'react';
import { Rect, Image as KonvaImage, Transformer } from 'react-konva';

// Custom hook to load images
const useImage = (src) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setImage(img);
      setLoading(false);
    };
    
    img.onerror = (err) => {
      setError(err);
      setLoading(false);
      console.error('Failed to load image:', src, err);
    };
    
    img.src = src;
  }, [src]);

  return [image, loading, error];
};

// Custom Image component with loading handling
export const URLImage = ({ imageProps }) => {
  const [image] = useImage(imageProps.src);
  return <KonvaImage {...imageProps} image={image} />;
};

// Rectangle Component
export const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, onDragMove }) => {
  const shapeRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        ref={shapeRef}
        {...shapeProps}
        stroke={isSelected ? '#3b82f6' : '#000000'}
        strokeWidth={isSelected ? 3 : 1}
        onDragMove={onDragMove}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Image Element Component
export const ImageElement = ({ shapeProps, isSelected, onSelect, onChange, onDragMove }) => {
  const shapeRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <URLImage
        imageProps={{
          ref: shapeRef,
          ...shapeProps,
          stroke: isSelected ? '#3b82f6' : 'transparent',
          strokeWidth: isSelected ? 3 : 0,
          onDragMove,
          draggable: true,
          onClick: onSelect,
          onTap: onSelect,
          onDragEnd: (e) => {
            onChange({
              x: e.target.x(),
              y: e.target.y(),
            });
          },
          onTransformEnd: (e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);
            
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            });
          },
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};