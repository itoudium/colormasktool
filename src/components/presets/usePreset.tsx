import { useEffect, useState } from "react";

export type PresetType = {
  name: string;
  rotation: number;
  seq: number;
  masks: [number, number][][];
};

export function usePreset() {
  const [presets, setPresets] = useState<PresetType[]>([]);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(
    null
  );
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // load presets from local storage on first time
    const localPresets = localStorage.getItem("presets");
    if (localPresets) {
      setPresets(JSON.parse(localPresets));
    }
  }, []);

  function createPreset(
    name: string,
    masks: [number, number][][],
    rotation: number,
    seq: number
  ) {
    const newPreset = { name, masks, rotation, seq };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem("presets", JSON.stringify(updatedPresets));
  }

  function 	deletePreset(index: number) {
    const updatedPresets = presets.slice();
    updatedPresets.splice(index, 1);
    setPresets(updatedPresets);
    localStorage.setItem("presets", JSON.stringify(updatedPresets));
  }

  function updatePreset(
    index: number,
    {
      masks,
      rotation,
      name,
    }: { masks?: [number, number][][]; rotation?: number; name?: string }
  ) {
    const updatedPresets = presets.slice();
    if (typeof masks !== "undefined") updatedPresets[index].masks = masks;
    if (typeof rotation !== "undefined")
      updatedPresets[index].rotation = rotation;
    if (typeof name !== "undefined") updatedPresets[index].name = name;
    setPresets(updatedPresets);
    localStorage.setItem("presets", JSON.stringify(updatedPresets));
  }

  return {
    presets,
    selectedPresetIndex,
    setSelectedPresetIndex,
    createPreset,
    deletePreset,
    updatePreset,
    isDirty,
    setIsDirty,
  };
}
