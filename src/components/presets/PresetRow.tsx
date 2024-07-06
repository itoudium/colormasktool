import IconDelete from "../icons/IconDelete";
import IconLoad from "../icons/IconLoad";
import { Button } from "../ui/button";
import { EditableText } from "./EditableText";
import { MiniSVG } from "./MiniSVG";
import type { PresetType } from "./usePreset";

export function PresetRow({
  isSelected,
  preset,
  onSelect,
  onDelete,
  onUpdateName,
}: {
  isSelected: boolean;
  preset: PresetType;
  onSelect: () => void;
  onDelete: () => void;
  onUpdateName: (name: string) => void;
}) {
  return (
    <div className="flex items-center my-2">
      <div className="text-sm">{isSelected ? "●" : "◌"}</div>
      <div className="mx-3">
        <MiniSVG size={30} masks={preset.masks} rotation={preset.rotation} />
      </div>
      <span className="flex-grow flex">
        <EditableText
          initialText={preset.name}
          onUpdate={(text) => {
            onUpdateName(text);
          }}
        />
      </span>
      <Button
        className="mx-1"
        onClick={(e) => {
          e.preventDefault();
          onSelect();
        }}
      >
        <IconLoad />
      </Button>
      <Button className="mx-1" onClick={() => onDelete()}>
        <IconDelete />
      </Button>
    </div>
  );
}
