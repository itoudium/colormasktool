import type { MouseEvent } from "react";
import { ColorWheel } from "./ColorWheel";

export const MaskedSquare = ({
	size = 100,
	masks = [],
	rotation = 0,
	onUpdate,
	onSelect,
	selectedMaskIndex,
}: {
	size: number;
	masks: [number, number][][];
	rotation: number;
	onUpdate: (masks: [number, number][][]) => void;
	onSelect: (index: number) => void;
	selectedMaskIndex: number | null;
}) => {
	return (
		<svg
			viewBox={`0 0 ${size} ${size}`}
			width={size}
			height={size}
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<mask id="combinedMask">
					<rect width="100%" height="100%" fill="white" />
					{masks.map((mask, index) => (
						<polygon
							key={index}
							points={mask
								.map((point) => `${point[0] * size},${point[1] * size}`)
								.join(" ")}
							fill="black"
						/>
					))}
				</mask>
			</defs>
			<ColorWheel diameter={size} rotation={rotation} />
			<circle
				cx={size / 2}
				cy={size / 2}
				r={size / 2}
				fill="white"
				opacity="0.8"
				mask="url(#combinedMask)"
			/>
			{masks.map((mask, index) => (
				<DraggablePolygon
					key={index}
					masks={masks}
					maskIndex={index}
					size={size}
					mask={mask}
					onUpdate={onUpdate}
					isSelected={index === selectedMaskIndex}
					onSelect={onSelect}
				/>
			))}
			{masks.map(
				(mask, maskIndex) =>
					maskIndex === selectedMaskIndex &&
					mask.map((point, pointIndex) => (
						<DraggablePoint
							key={`${maskIndex}-${pointIndex}`}
							masks={masks}
							maskIndex={maskIndex}
							pointIndex={pointIndex}
							point={point}
							size={size}
							onUpdate={onUpdate}
						/>
					)),
			)}
		</svg>
	);
};

const DraggablePolygon = ({
	masks,
	maskIndex,
	size,
	mask,
	onUpdate,
	onSelect,
	isSelected: isSelect,
}: {
	masks: [number, number][][];
	maskIndex: number;
	size: number;
	mask: [number, number][];
	onUpdate: (masks: [number, number][][]) => void;
	onSelect: (index: number) => void;
	isSelected: boolean;
}) => {
	const points = mask.map(([x, y]) => `${x * size},${y * size}`).join(" ");

	const handleMouseDown = (e: MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onSelect(maskIndex);
		const { x: startX, y: startY } = getEventPosition(e);

		const handleMouseMove = (moveEvent: any) => {
			moveEvent.preventDefault();
			const { x: currentX, y: currentY } = getEventPosition(moveEvent);
			const dx = currentX - startX;
			const dy = currentY - startY;

			const updated = masks.map((mask, index) => {
				if (index !== maskIndex) return mask;
				return mask.map(
					([x, y]) => [x + dx / size, y + dy / size] as [number, number],
				);
			});
			onUpdate(updated);
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleMouseMove);
			document.removeEventListener("touchend", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchmove", handleMouseMove);
		document.addEventListener("touchend", handleMouseUp);
	};

	return (
		<polygon
			points={points}
			fill="transparent"
			stroke="black"
			strokeWidth="0"
			style={{ cursor: "grab" }}
			onMouseDown={handleMouseDown}
			onTouchStart={handleMouseDown}
			onClick={(e) => e.stopPropagation()}
		/>
	);
};

function getEventPosition(event: MouseEvent | React.TouchEvent) {
	if (event.type.startsWith("touch")) {
		const touch =
			(event as React.TouchEvent).touches[0] ||
			(event as React.TouchEvent).changedTouches[0];
		return { x: touch.clientX, y: touch.clientY };
	} else {
		return {
			x: (event as MouseEvent).clientX,
			y: (event as MouseEvent).clientY,
		};
	}
}

const DraggablePoint = ({
	masks,
	maskIndex,
	pointIndex,
	point,
	size,
	onUpdate,
}: {
	masks: [number, number][][];
	maskIndex: number;
	pointIndex: number;
	point: [number, number];
	size: number;
	onUpdate: (masks: [number, number][][]) => void;
}) => {
	const x = point[0] * size;
	const y = point[1] * size;

	const handleMouseDown = (e: MouseEvent | React.TouchEvent) => {
		e.stopPropagation();
		e.preventDefault();
		const { x: startX, y: startY } = getEventPosition(e);
		const initialX = x;
		const initialY = y;

		const handleMouseMove = (moveEvent: any) => {
			moveEvent.preventDefault();
			moveEvent.stopPropagation();
			const { x: currentX, y: currentY } = getEventPosition(moveEvent);
			const dx = currentX - startX;
			const dy = currentY - startY;

			const updatedX = initialX + dx;
			const updatedY = initialY + dy;

			const result = masks.map((mask, index) => {
				if (index !== maskIndex) return mask;
				return mask.map((p, index) => {
					if (index !== pointIndex) return p;
					return [updatedX / size, updatedY / size] as [number, number];
				});
			});

			onUpdate(result);
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleMouseMove);
			document.removeEventListener("touchend", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchmove", handleMouseMove, { passive: false });
		document.addEventListener("touchend", handleMouseUp);
	};

	return (
		<circle
			cx={x}
			cy={y}
			r="15"
			fill="gray"
			onMouseDown={handleMouseDown}
			onTouchStart={handleMouseDown}
			style={{ cursor: "pointer" }}
			onClick={(e) => e.stopPropagation()}
		/>
	);
};
