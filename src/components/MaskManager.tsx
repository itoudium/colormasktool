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

  // debug logging masks
  console.debug(masks);

  const addPresetMask = (newMask: MaskType) => {
    setMasks([...masks, newMask]);
    setSelectedMaskIndex(masks.length);
  };

  const presets: Record<string, MaskType> = {
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

  const deleteMask = (index: number) => {
    const updatedMasks = masks.slice();
    updatedMasks.splice(index, 1);
    setMasks(updatedMasks);
    setSelectedMaskIndex(null);
  };

  const handleRemove = () => {
    if (selectedMaskIndex != null) deleteMask(selectedMaskIndex);
    setSelectedMaskIndex(null);
  };

  return (
    <div
      className="flex flex-col w-full items-center mt-10"
      onClick={() => setSelectedMaskIndex(null)}
    >
      <div style={{ flex: 1, maxWidth: `${size}px` }}>
        <div style={{ position: "relative" }} className="m-auto">
          <MaskedSquare
            size={size}
            masks={masks}
            onUpdate={(newMasks) => setMasks(newMasks)}
            onSelect={(index) => setSelectedMaskIndex(index)}
            selectedMaskIndex={selectedMaskIndex}
            rotation={rotation}
          />
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
    </div>
  );
};
