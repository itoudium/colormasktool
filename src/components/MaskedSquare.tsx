import React, { useState } from "react";

const ItemTypes = {
  MASK: "mask",
  POINT: "point",
};

export const MaskedSquare = ({ size = 100, masks = [], onUpdate }) => {

  return (
    <svg
      width={size}
      height={size}
      style={{ border: "1px solid black" }}
    >
      <defs>
        <mask id="combinedMask">
          <rect width="100%" height="100%" fill="white" />
          {masks.map((mask, index) => (
            <polygon
              key={index}
              points={mask.map(point => `${point[0] * size},${point[1] * size}`).join(' ')}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <rect width={size} height={size} fill="white" opacity="0.8" mask="url(#combinedMask)" />
      {masks.map((mask, index) => (
        <DraggablePolygon
          key={index}
          masks={masks}
          maskIndex={index}
          size={size}
          mask={mask}
          onUpdate={onUpdate}
        />
      ))}
      {masks.map((mask, maskIndex) =>
        mask.map((point, pointIndex) => (
          <DraggablePoint
            key={`${maskIndex}-${pointIndex}`}
            masks={masks}
            maskIndex={maskIndex}
            pointIndex={pointIndex}
            point={point}
            size={size}
            onUpdate={onUpdate}
          />
        ))
      )}
    </svg>
  );
};

const DraggablePolygon = ({ masks, maskIndex, size, mask, onUpdate }) => {
  const points = mask.map(([x, y]) => `${x * size},${y * size}`).join(" ");

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPoints = points;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      const updated = masks.map((mask, index) => {
        if (index !== maskIndex) return mask;
        return mask.map(([x, y]) => [x + dx / size, y + dy / size]);
      });
      onUpdate(updated);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <polygon
      points={points}
      fill="transparent"
      stroke="black"
      strokeWidth="1"
      style={{ cursor: "grab" }}
      onMouseDown={handleMouseDown}
    />
  );
};

const DraggablePoint = ({
  masks,
  maskIndex,
  pointIndex,
  point,
  size,
  onUpdate,
}) => {
  const x = point[0] * size;
  const y = point[1] * size;

  const handleMouseDown = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = x;
    const initialY = y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      const updatedX = initialX + dx;
      const updatedY = initialY + dy;

      const result = masks.map((mask, index) => {
        if (index !== maskIndex) return mask;
        return mask.map((p, index) => {
          if (index !== pointIndex) return p;
          return [updatedX / size, updatedY / size];
        });
      });

      onUpdate(result);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <circle
      cx={x}
      cy={y}
      r="5"
      fill="red"
      onMouseDown={handleMouseDown}
      style={{ cursor: "pointer" }}
    />
  );
};
