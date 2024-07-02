import { Button } from "../ui/button";
import { MiniSVG } from "./MiniSVG";
import type { PresetType } from "./usePreset";

export function PresetRow({
  isSelected,
  preset,
  onSelect,
  onDelete,
}: {
  isSelected: boolean;
  preset: PresetType;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center my-2">
      <div className="text-sm">
        {isSelected ? "●" : "◌"}
      </div>
      <div className="mx-3">
        <MiniSVG size={30} masks={preset.masks} rotation={preset.rotation} />
      </div>
      <span className="flex-grow">{preset.name}</span>
      <Button
        className="mx-1"
        onClick={(e) => {
          e.preventDefault();
          onSelect();
        }}
      >
        ⬆️
      </Button>
      <Button className="mx-1" variant="outline" onClick={() => onDelete()}>
        🗑️
      </Button>
    </div>
  );
}
