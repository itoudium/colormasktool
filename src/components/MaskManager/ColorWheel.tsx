export const ColorWheel = ({
	lightness = 50,
	diameter = 200,
	rotation = 0,
}) => {
	const colors = [
		0,
		30,
		60,
		90,
		120,
		150,
		180,
		210,
		240,
		270,
		300,
		330, // 各色のH (色相角) 値
	];
	const rotationBase = -15;
	const segments = 10;
	const radius = diameter / 2;
	const centerX = radius;
	const centerY = radius;
	const overlapFactor = 0.5; // 内外半径間のオーバーラップ因子
	const angleOverlapFactor = 1; // 角度のオーバーラップ因子（必要に応じて調整）

	// ヘルパー関数: HSLカラーを取得
	const getColorHSL = (hue: number, saturation: number, lightness: number) => {
		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	};

	return (
		<g>
			{Array.from({ length: segments }, (_, i) => {
				const innerRadius = radius * (i / segments) - overlapFactor;
				const outerRadius = radius * ((i + 1) / segments) + overlapFactor;
				const saturation = (i / segments) * 100; // 彩度の計算(0%から100%)

				return colors.map((hue, index) => {
					// 開始角度と終了角度にオーバーラップ因子を考慮する
					const startAngle =
						rotationBase +
						(index / colors.length) * 360 +
						rotation * 360 -
						angleOverlapFactor;
					const endAngle =
						rotationBase +
						((index + 1) / colors.length) * 360 +
						rotation * 360 +
						angleOverlapFactor;
					const largeArc = endAngle - startAngle > 180 ? 1 : 0;

					// 外側円の開始点と終了点の計算
					const startOuterX =
						centerX +
						outerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
					const startOuterY =
						centerY +
						outerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);
					const endOuterX =
						centerX + outerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
					const endOuterY =
						centerY + outerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);

					// 内側円の開始点と終了点の計算
					const startInnerX =
						centerX +
						innerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
					const startInnerY =
						centerY +
						innerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);
					const endInnerX =
						centerX + innerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
					const endInnerY =
						centerY + innerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);

					const color = getColorHSL(hue, saturation, lightness);

					return (
						<path
							key={`${hue}-${i}`}
							d={`M${startOuterX},${startOuterY} A${outerRadius},${outerRadius} 0 ${largeArc},1 ${endOuterX},${endOuterY} L${endInnerX},${endInnerY} A${innerRadius},${innerRadius} 0 ${largeArc},0 ${startInnerX},${startInnerY} Z`}
							fill={color}
						/>
					);
				});
			})}
			{/* 中心部にグレーの円を描画 */}
			<circle
				cx={centerX}
				cy={centerY}
				r={radius / segments}
				fill={`hsl(0, 0%, ${lightness}%)`}
			/>
		</g>
	);
};
