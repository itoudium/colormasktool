type Props = {
  size: number;
  rotation: number;
  masks: number[][][];
};

export function MiniSVG({ size, rotation, masks }: Props) {
  const uniqueMaskId = Math.random().toString(36).substring(7);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id={`combinedMask-${uniqueMaskId}`}>
          <rect width="100%" height="100%" fill="white" />$
          {masks.map((mask, index) => (
            <polygon
              points={mask
                .map((point) => `${point[0] * size},${point[1] * size}`)
                .join(" ")}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <ColorWheel size={size} rotation={rotation} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2}
        fill="white"
        opacity="0.8"
        mask={`url(#${`combinedMask-${uniqueMaskId}`})`}
      />
    </svg>
  );
}

export function ColorWheel({
  size,
  rotation,
}: {
  size: number;
  rotation: number;
}) {
  const lightness = 50;
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
  const segments = 5;
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const overlapFactor = 0.5; // 内外半径間のオーバーラップ因子
  const angleOverlapFactor = 1; // 角度のオーバーラップ因子（必要に応じて調整）

  // ヘルパー関数: HSLカラーを取得
  const getColorHSL = (hue: number, saturation: number, lightness: number) => {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <>
      {Array.from({ length: segments }, (_, i) => {
        const innerRadius = radius * (i / segments) - overlapFactor;
        const outerRadius = radius * ((i + 1) / segments) + overlapFactor;
        const saturation = (i / segments) * 100; // 彩度の計算(0%から100%)

        return colors.map((hue, index) => {
          // 開始角度と終了角度にオーバーラップ因子を考慮する
          const startAngle =
            (index / colors.length) * 360 + rotation * 360 - angleOverlapFactor;
          const endAngle =
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
              d={`M${startOuterX},${startOuterY} A${outerRadius},${outerRadius} 0 ${largeArc},1 ${endOuterX},${endOuterY} L${endInnerX},${endInnerY} A${innerRadius},${innerRadius} 0 ${largeArc},0 ${startInnerX},${startInnerY} Z`}
              fill={color}
            />
          );
        });
      })}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius / segments}
        fill={`hsl(0, 0%, ${lightness}%)`}
      />
      ;
    </>
  );
}
