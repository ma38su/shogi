import type { XY, XYArray } from "./geometry";

function polylinesToPath(polylines: XYArray[]) {
  const pathList: string[] = [];
  for (const polyline of polylines) {
    if (polyline.length === 0) {
      continue;
    }
    const [x0, y0] = polyline[0];
    pathList.push(`M ${x0},${y0}`);
    for (let i = 1; i < polyline.length; ++i) {
      const [x, y] = polyline[i];
      pathList.push(`L ${x},${y}`);
    }
  }
  return pathList.join(' ');
}

function pointsToPath(points: XY[]) {
  const pathList: string[] = [];
  for (const p of points) {
    const [x, y] = p;
    pathList.push(`M ${x},${y}`);
  }
  return pathList.join(' ');
}

function polylineToPoints(polyline: XYArray) {
  const pathList: string[] = [];
  for (let i = 0; i < polyline.length; ++i) {
    const [x, y] = polyline[i];
    pathList.push(`${x},${y}`);
  }
  return pathList.join(' ');
}

function generateGrid(rows: number, columns: number, cell: number) {
  const pathList: string[] = [];

  const minY = 0;
  const maxY = rows * cell;
  const minX = 0;
  const maxX = columns * cell;

  for (let i = 0; i <= rows; ++i) {
    const x = i * cell;
    pathList.push(`M ${x},${minY}`);
    pathList.push(`L ${x},${maxY}`);
  }
  for (let i = 0; i <= columns; ++i) {
    const y = i * cell;
    pathList.push(`M ${minX},${y}`);
    pathList.push(`L ${maxX},${y}`);
  }
  return pathList.join(' ');
}

function pointToCircle(p: XY, r: number) {
  const [x, y] = p;
  return <circle key={`${x}.${y}.${r}`} cx={x} cy={y} r={r} />
}

export { polylinesToPath, generateGrid, polylineToPoints, pointsToPath, pointToCircle }
