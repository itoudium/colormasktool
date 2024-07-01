import React, { useState } from "react";
import { MaskedSquare } from "./MaskedSquare";
import { ColorWheel } from "./ColorWheel";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const MaskManager = () => {
  const [masks, setMasks] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(400);
  const [selectedMaskIndex, setSelectedMaskIndex] = useState(null);

  const addPresetMask = (newMask) => {
    setMasks([...masks, newMask]);
  };

  const presets = {
    "正三角形 大": [
      [0.5, 0.1],
      [0.1, 0.9],
      [0.9, 0.9],
    ],
    "正三角形 中": [
      [0.5, 0.2],
      [0.3, 0.7],
      [0.7, 0.7],
    ],
    "正三角形 小": [
      [0.5, 0.4],
      [0.4, 0.6],
      [0.6, 0.6],
    ],
    スクエア: [
      [0.3, 0.3],
      [0.7, 0.3],
      [0.7, 0.7],
      [0.3, 0.7],
    ],
    縦に長い長方形: [
      [0.1, 0.2],
      [0.3, 0.2],
      [0.3, 0.8],
      [0.1, 0.8],
    ],
    菱形: [
      [0.5, 0.1],
      [0.9, 0.5],
      [0.5, 0.9],
      [0.1, 0.5],
    ],
    直角二等辺三角形: [
      [0.1, 0.9],
      [0.1, 0.5],
      [0.5, 0.9],
    ],
  };

  const updateMask = (index, newPoints) => {
    const updatedMasks = masks.slice();
    updatedMasks[index] = newPoints;
    setMasks(updatedMasks);
  };

  const deleteMask = (index) => {
    const updatedMasks = masks.slice();
    updatedMasks.splice(index, 1);
    setMasks(updatedMasks);
    setSelectedMaskIndex(null);
  };

  return (
    <div className="flex flex-col w-full items-center">
      <div style={{ flex: 1, maxWidth: `${size}px` }}>
        <h1>SVG Mask Editor</h1>
        <div style={{ position: "relative" }} className="m-auto">
          <ColorWheel diameter={size} rotation={rotation} />
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <MaskedSquare
              size={size}
              masks={masks}
              onUpdate={(newMasks) => setMasks(newMasks)}
            />
          </div>
        </div>
        <div className="p-10">
          <Slider
            defaultValue={[rotation]}
            max={1}
            step={0.002}
            onValueChange={(v) => setRotation(v[0])}
          />
        </div>
        {/* {Object.keys(presets).map((presetName) => (
          <Button
            key={presetName}
            onClick={() => addPresetMask(presets[presetName])}
          >
            {presetName}
          </Button>
        ))} */}
{/*  add  */}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>+ Add mask</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
            {Object.keys(presets).map((presetName) => (
              <DropdownMenuItem key={presetName} onClick={() => addPresetMask(presets[presetName])}>
                {presetName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>


      </div>
      <div style={{ flex: 1 }}>
        <h2>Mask Management</h2>
        <ul>
          {masks.map((_, index) => (
            <li key={index}>
              <button onClick={() => setSelectedMaskIndex(index)}>
                Edit Mask {index + 1}
              </button>
              <button onClick={() => deleteMask(index)}>
                Delete Mask {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedMaskIndex !== null && (
        <div style={{ flex: 1 }}>
          <h2>Edit Mask {selectedMaskIndex + 1}</h2>
          <ul>
            {masks[selectedMaskIndex].map((point, pointIndex) => (
              <li key={pointIndex}>
                <input
                  type="number"
                  step="0.01"
                  value={point[0]}
                  onChange={(e) => {
                    const newPoint = [parseFloat(e.target.value), point[1]];
                    const newPoints = masks[selectedMaskIndex].slice();
                    newPoints[pointIndex] = newPoint;
                    updateMask(selectedMaskIndex, newPoints);
                  }}
                />
                <input
                  type="number"
                  step="0.01"
                  value={point[1]}
                  onChange={(e) => {
                    const newPoint = [point[0], parseFloat(e.target.value)];
                    const newPoints = masks[selectedMaskIndex].slice();
                    newPoints[pointIndex] = newPoint;
                    updateMask(selectedMaskIndex, newPoints);
                  }}
                />
                <button
                  onClick={() => {
                    const newPoints = masks[selectedMaskIndex].slice();
                    newPoints.splice(pointIndex, 1);
                    updateMask(selectedMaskIndex, newPoints);
                  }}
                >
                  Remove Point
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              const newPoints = masks[selectedMaskIndex].slice();
              newPoints.push([0.5, 0.5]); // デフォルト位置でポイント追加
              updateMask(selectedMaskIndex, newPoints);
            }}
          >
            Add Point
          </button>
        </div>
      )}
    </div>
  );
};
