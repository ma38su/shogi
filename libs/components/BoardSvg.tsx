import React from "react";
import { Color, PieceType } from "../shogi";
import { generateGrid, polylinesToPath, polylineToPoints } from "../svg";
import { PieceSvg } from "./PieceSvg";

const yLabel = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const XLabel = React.memo(function XLabel() {
  return (
    <>
    {
        [1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map((n, i) => <text key={n} fontSize={0.4} textAnchor='middle' transform={`translate(${8.5-i},-0.2)`}>{n}</text>)
    }
    </>
  )
});
const YLabel = React.memo(function YLabel() {
  return (
    <>
    {
      ['一', '二', '三', '四', '五', '六', '七', '八', '九']
        .map((n, i) => <text key={n} fontSize={0.4} textAnchor='middle' transform={`translate(${9.5},${i+0.7})`}>{n}</text>)
    }
    </>
  )
});

type VisibilityOption = 'Index';

type Props = {
  position: Map<string, [PieceType, Color]>,
  visibilityOptions?: VisibilityOption[],
};

const indexList: number[] = [];
for (let i = 0; i < 81; ++i) {
  indexList.push(i);
}

function BoardSvg(props: Props) {

  const { position, visibilityOptions } = props;
  const gridSize = 1;
  const margin = 1;
  const scale = 40;
  const widthGuide = 30;
  const heightGuide = 30;
  const width = (9 * gridSize)*scale + margin * 2 + widthGuide;
  const height = (9 * gridSize)*scale + margin * 2 + heightGuide;

  const onClick = (x: number, y: number, color: Color, type: PieceType) => {
    console.log({x, y, color, type});
    alert(`x: ${x}, y: ${y}, color: ${color}, type: ${type}`);
  };

  return (
    <svg {...{width, height}} className='disable-select'>
      <g transform={`translate(${margin},${margin+heightGuide}) scale(${scale},${scale})`}>

        <XLabel />
        <YLabel />
        {
          visibilityOptions?.includes('Index') && (
            // index
            indexList.map((n, i) => {
              const y = i % 9;
              const x = Math.floor(i/9);
              return <text key={n} fontSize={0.4} fill='#ccc' textAnchor='middle' transform={`translate(${8.5-x},${y+0.65})`}>{yLabel[y]}{x+1}</text>
            })
          )
        }

        <path d={generateGrid(9, 9, gridSize)} strokeWidth={1/scale} stroke='#888' fill='none' />

        {
          Array.from(position.entries()).map(([key, [type, color]]) => {
            const i = key.substring(0, 1);
            const j = key.substring(1);

            const y = yLabel.findIndex(value => value === i);
            const x = 8 - (Number(j) - 1);

            return <PieceSvg key={key} {...{type, x, y, first: color === 'B', scale, onClick}} />
          })
        }
      </g>
    </svg>
  );
}

export { BoardSvg }