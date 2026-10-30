import React from 'react';

interface PDF417BarcodeProps {
  tedXml?: string;
  folio?: number;
  tipoDTE?: number;
  resolucionNumero?: number;
  resolucionFecha?: string;
}

export const PDF417Barcode: React.FC<PDF417BarcodeProps> = ({
  folio = 45,
  tipoDTE = 33,
  resolucionNumero = 80,
  resolucionFecha = '2025'
}) => {
  // Generates a deterministic, high-density SVG visual representation of a PDF417 2D barcode
  const rows = 14;
  const cols = 56;

  // Pseudo-random but deterministic pattern based on folio & tipoDTE
  const generatePattern = () => {
    const pattern: boolean[][] = [];
    const seed = (folio * 17 + tipoDTE * 31) % 997;
    for (let r = 0; r < rows; r++) {
      const rowArr: boolean[] = [];
      for (let c = 0; c < cols; c++) {
        // PDF417 start & stop bar patterns
        if (c < 3 || c >= cols - 3) {
          rowArr.push((c + r) % 2 === 0);
        } else {
          const val = Math.sin(r * 12.9898 + c * 78.233 + seed) * 43758.5453;
          rowArr.push((val - Math.floor(val)) > 0.48);
        }
      }
      pattern.push(rowArr);
    }
    return pattern;
  };

  const grid = React.useMemo(() => generatePattern(), [folio, tipoDTE]);

  return (
    <div className="border-2 border-black p-3 bg-white text-center inline-block rounded-sm max-w-sm select-none font-mono">
      {/* Top Header */}
      <div className="text-[10px] font-bold tracking-tight text-black border-b border-black pb-1 mb-1.5 uppercase">
        Timbre Electrónico SII
      </div>

      {/* Barcode Body (SVG) */}
      <div className="flex justify-center my-1 bg-white">
        <svg
          viewBox={`0 0 ${cols * 3} ${rows * 6}`}
          className="w-56 h-20 max-w-full"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
        >
          {grid.map((row, rIdx) =>
            row.map((filled, cIdx) => (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx * 3}
                y={rIdx * 6}
                width={3}
                height={6}
                fill={filled ? '#000000' : '#ffffff'}
              />
            ))
          )}
        </svg>
      </div>

      {/* Legal Footer Resolution Info */}
      <div className="text-[8px] font-semibold text-black tracking-tighter mt-1 border-t border-black pt-1 leading-tight">
        <div>Res. {resolucionNumero} de {resolucionFecha} - Verifique en www.sii.cl</div>
        <div className="text-[7px] text-gray-700 mt-0.5">DTE TIPO {tipoDTE} • FOLIO {folio}</div>
      </div>
    </div>
  );
};
