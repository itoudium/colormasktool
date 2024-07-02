import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "../ui/button";
import type { usePreset } from "./usePreset";
import { PresetRow } from "./PresetRow";

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
      presetHook.updatePreset(presetHook.selectedPresetIndex, masks, rotation);
      presetHook.setIsDirty(false);
    } else {
      // create
      const seq = (Math.max(...presetHook.presets.map((preset) => preset.seq), 0) || 0) + 1;
      presetHook.createPreset(`Preset ${seq}`, masks, rotation, seq);
      presetHook.setSelectedPresetIndex(presetHook.presets.length);
      presetHook.setIsDirty(false);
    }
  }

  return (
    <>
      <div className="flex">
        <Button
          className="grow flex items-center justify-between mr-2"
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
        >
          <span>
            {currentPresetName}
            {presetHook.isDirty && " *"}
          </span>
          <span>▾</span>
        </Button>
        <Button variant="outline" onClick={handleSave}>💾</Button>
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
              />
            ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
