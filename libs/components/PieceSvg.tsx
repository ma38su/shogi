import { XYArray } from "../geometry";
import { PieceType } from "../shogi";
import { polylineToPoints } from "../svg";

function createPiece(): XYArray {
  return [
    [0.5, 0.1],
    [0.8, 0.25],
    [0.9, 0.9],
    [0.1, 0.9],
    [0.2, 0.25],
  ]
}

const piecePoints = polylineToPoints(createPiece());

function PieceSvg(props: {type: PieceType, x: number, y: number, first: boolean, scale: number, onClick: (x: number, y: number, color: Color, type: PieceType) => void}) {
  const { type, x, y, first, scale, onClick } = props;
  return (
    <g transform={first ? `translate(${x},${y})` : `translate(${x+1},${y+1}) scale(-1,-1)`} name={`${y}${x}${first?'b':'w'}${type}`} onClick={() => onClick(x, y, first ? 'B' : 'W', type)}>
      <polygon points={piecePoints} strokeWidth={1/scale} stroke='#222' fill='none' />
      <text fontFamily={'Noto Serif JP, serif'} fontSize={0.55} textAnchor='middle' transform={`translate(0.5,0.75)`}>{type}</text>
    </g>
  );
}
export { PieceSvg };
