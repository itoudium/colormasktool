import React, { useState, useCallback } from "react";

const Vertex = ({ x, y, onMove }) => {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = x;
    const initialY = y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onMove(initialX + dx, initialY + dy);
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
      style={{ cursor: "move" }}
    />
  );
};

const Polygon = () => {
  const [vertices, setVertices] = useState([
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 200 },
    { x: 100, y: 200 },
  ]);

  const moveVertex = useCallback((index, newX, newY) => {
    setVertices((prevVertices) =>
      prevVertices.map((vertex, i) =>
        i === index ? { x: newX, y: newY } : vertex
      )
    );
  }, []);

  const movePolygon = useCallback(
    (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startVertices = vertices;

      const handleMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        setVertices(
          startVertices.map((vertex) => ({
            x: vertex.x + dx,
            y: vertex.y + dy,
          }))
        );
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [vertices]
  );

  const points = vertices.map((v) => `${v.x},${v.y}`).join(" ");

  return (
    <g onMouseDown={movePolygon}>
      <polygon points={points} fill="lightblue" stroke="black" />
      {vertices.map((vertex, index) => (
        <Vertex
          key={index}
          x={vertex.x}
          y={vertex.y}
          onMove={(newX, newY) => moveVertex(index, newX, newY)}
        />
      ))}
    </g>
  );
};

function App() {
  return (
    <div className="App">
      <svg width="600" height="400">
        <Polygon />
      </svg>
    </div>
  );
}

export default App;
