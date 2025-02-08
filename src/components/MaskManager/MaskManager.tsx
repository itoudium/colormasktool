import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { ColorWheel } from "./ColorWheel";
import { MaskedSquare } from "./MaskedSquare";
import { PresetManager, usePreset } from "../presets";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";

type MaskType = [number, number][];

export const MaskManager = () => {
	const presetHook = usePreset();
	const [masks, setMasks] = useState<MaskType[]>([]);
	const [rotation, setRotation] = useState(0);
	const [size, setSize] = useState(Math.min(380, window.innerWidth * 0.9));
	const [selectedMaskIndex, setSelectedMaskIndex] = useState<number | null>(
		null,
	);
	const [presetLoaded, setPresetLoaded] = useState(false);

	// debug logging masks
	console.debug(masks);

	// handle change selected preset
	useEffect(() => {
		if (presetHook.selectedPresetIndex !== null) {
			setMasks([...presetHook.presets[presetHook.selectedPresetIndex].masks]);
			setRotation(presetHook.presets[presetHook.selectedPresetIndex].rotation);
			setPresetLoaded(true);
		} else {
			setMasks([]);
			setRotation(0);
			setPresetLoaded(true);
		}
	}, [presetHook.selectedPresetIndex]);

	// handle dirty state
	useEffect(() => {
		if (presetLoaded) {
			setPresetLoaded(false);
			presetHook.setIsDirty(false);
		} else {
			presetHook.setIsDirty(true);
		}
	}, [masks, rotation]);

	const addTemplateMask = (newMask: MaskType) => {
		setMasks([...masks, newMask]);
		setSelectedMaskIndex(masks.length);
	};

	const templates: Record<string, MaskType> = {
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

	const { toast } = useToast();

	// HOTFIX: toastを一度表示して消さないとボタンが操作できない
	useEffect(() => {
		const t = toast({
			title: "",
		})
		setTimeout(()=> {
			t.dismiss();
		}, 10);
	}, []);

	return (
		<div
			className="flex flex-col w-full items-center mt-10"
			onClick={() => setSelectedMaskIndex(null)}
		>
			<div style={{ flex: 1, maxWidth: `${size}px` }}>
				<PresetManager
					presetHook={presetHook}
					masks={masks}
					rotation={rotation}
				/>
				<div className="relative mx-auto mt-10">
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
							{Object.keys(templates).map((templateName) => (
								<DropdownMenuItem
									key={templateName}
									onClick={() => addTemplateMask(templates[templateName])}
								>
									{templateName}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{selectedMaskIndex != null && (
						<Button onClick={handleRemove}>- Remove</Button>
					)}
				</div>
			</div>
			<Toaster />
		</div>
	);
};
