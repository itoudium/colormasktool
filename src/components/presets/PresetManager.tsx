import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "../ui/button";
import { PresetRow } from "./PresetRow";
import type { usePreset } from "./usePreset";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function PresetManager({
  presetHook,
  masks,
  rotation,
}: {
  presetHook: ReturnType<typeof usePreset>;
  masks: [number, number][][];
  rotation: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const currentPresetName =
    presetHook.selectedPresetIndex !== null
      ? presetHook.presets[presetHook.selectedPresetIndex].name
      : "New Preset";

  function handleSave() {
    if (presetHook.selectedPresetIndex !== null) {
      // update
      presetHook.updatePreset(presetHook.selectedPresetIndex, {
        masks,
        rotation,
      });
      presetHook.setIsDirty(false);
    } else {
      // create
      const seq =
        (Math.max(...presetHook.presets.map((preset) => preset.seq), 0) || 0) +
        1;
      presetHook.createPreset(`Preset ${seq}`, masks, rotation, seq);
      presetHook.setSelectedPresetIndex(presetHook.presets.length);
      presetHook.setIsDirty(false);
    }
  }

  return (
    <TooltipProvider>
      <div className="flex">
        <Tooltip>
          <Button
            className="grow mr-2 flex"
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            >
              <TooltipTrigger>
                <div className="flex items-center justify-between ">
                  <span>
                    {currentPresetName}
                    {presetHook.isDirty && " *"}
                  </span>
                  <span>▾</span>
                </div>
              </TooltipTrigger>
            </Button>
          <TooltipContent><p>Select preset</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" onClick={handleSave}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Save as preset</p></TooltipContent>
        </Tooltip>
      </div>
      <div className="relative">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="w-full min-h-screen absolute z-10 bg-background">
            <Button
              className="w-full underline my-2"
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                presetHook.setSelectedPresetIndex(null);
              }}
            >
              New
            </Button>
            <div className="flex flex-col-reverse mb-20">
              {presetHook.presets.map((preset, index) => (
                <PresetRow
                  isSelected={presetHook.selectedPresetIndex === index}
                  key={index}
                  preset={preset}
                  onSelect={() => {
                    setIsOpen(false);
                    presetHook.setSelectedPresetIndex(index);
                  }}
                  onDelete={() => {
                    presetHook.deletePreset(index);
                    presetHook.setSelectedPresetIndex(null);
                  }}
                  onUpdateName={(name) => {
                    presetHook.updatePreset(index, {
                      masks: preset.masks,
                      rotation: preset.rotation,
                      name,
                    });
                  }}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  );
}
