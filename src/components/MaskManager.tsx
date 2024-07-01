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
} from "@/components/ui/dropdown-menu";

type MaskType = [number, number][];

export const MaskManager = () => {
  const [masks, setMasks] = useState<MaskType[]>([]);
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(400);
  const [selectedMaskIndex, setSelectedMaskIndex] = useState<number | null>(
    null
  );

  const addPresetMask = (newMask: MaskType) => {
    setMasks([...masks, newMask]);
    setSelectedMaskIndex(masks.length);
  };

  const presets = {
    "▲": [
      [0.5, 0.0],
      [0.125, 0.5],
      [0.875, 0.5],
    ],
    "◣": [
      [0.32, 0.18],
      [0.32, 0.83],
      [0.68, 0.83],
    ],
    "◢": [
      [0.1, 0.5],
      [0.5, 0.5],
      [0.5, 0.0],
    ],
    "♦": [
      [0.5, 0.2],
      [0.65, 0.5],
      [0.5, 0.8],
      [0.35, 0.5],
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

  const handleRemove = () => {
    deleteMask(selectedMaskIndex);
    setSelectedMaskIndex(null);
  }

  return (
    <div
      className="flex flex-col w-full items-center"
      onClick={() => setSelectedMaskIndex(null)}
    >
      <div style={{ flex: 1, maxWidth: `${size}px` }}>
        <h1>SVG Mask Editor</h1>
        <div style={{ position: "relative" }} className="m-auto">
          <ColorWheel diameter={size} rotation={rotation} />
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <MaskedSquare
              size={size}
              masks={masks}
              onUpdate={(newMasks) => setMasks(newMasks)}
              onSelect={(index) => setSelectedMaskIndex(index)}
              selectedMaskIndex={selectedMaskIndex}
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

        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button>+ Add mask</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
              {Object.keys(presets).map((presetName) => (
                <DropdownMenuItem
                  key={presetName}
                  onClick={() => addPresetMask(presets[presetName])}
                >
                  {presetName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedMaskIndex != null && (
            <Button onClick={handleRemove}>- Remove</Button>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <h1>inspect</h1>
        {masks.map((mask, index) => (
          <div key={index}>
            <pre>{JSON.stringify(mask)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};
