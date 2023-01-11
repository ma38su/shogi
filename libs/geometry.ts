const GridAngles = [
    0,
    90,
    180,
    270,
] as const;

const WEST: GridAngle = 0;
const NORTH: GridAngle = 90;
const EAST: GridAngle = 180;
const SOUTH: GridAngle = 270;

const GridAngleLabels: Map<GridAngle, string> = new Map([
    [NORTH, '北'],
    [SOUTH, '南'],
    [EAST, '東'],
    [WEST, '西'],
]);

type GridAngle = typeof GridAngles[number];

type XY = readonly [number, number];
type XYArray = readonly XY[];
type Triangle = [XY, XY, XY];

type PolylinesLayer = {
    floor: number,
    polylines: XYArray[],
};

function mergePolylinesLayer(target: PolylinesLayer[], layers: PolylinesLayer[]) {
    target.push(...layers);
}

type TransFunc = (x: number, y: number) => XY;


function toBounds(pts: readonly XY[]): [number, number, number, number] | undefined {
    if (!pts || pts.length == 0) {
        return;
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    
    for (const [x, y] of pts) {
        minX = Math.min(x, minX);
        minY = Math.min(y, minY);
        maxX = Math.max(x, maxX);
        maxY = Math.max(y, maxY);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
        throw new Error(`${minX}, ${minY}, ${maxX}, ${maxY}`);
    }
    return [minX, minY, maxX, maxY];
}

function getDirection(p1: XY, p2: XY) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    if (x1 === x2) {
        if (y1 > y2) {
            return 0; // NORTH (+y)
        } else if (y1 < y2) {
            return 180; // SOUTH (-y)
        }
    } else if (y1 === y2) {
        if (x1 > x2) {
            return 90;  // WEST (-x)
        } else if (x1 < x2) {
            return 270; // EAST (+x)
        }
    }
    throw new Error(`${p1}, ${p2}`);
}

function createRectanglePolygon(width: number, height: number): XYArray {
  return [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height]
  ];
}

function transformPolylines(polylines: XYArray[], transFunc: TransFunc) {
    return polylines.map(polyline => transformPolyline(polyline, transFunc));
}

function transformPolyline(polyline: XYArray, transFunc: TransFunc) {
    return polyline.map(xy => transFunc(...xy));
}

function polygonToPolyline(polygon: readonly XY[]) {
    return [...polygon, polygon[0]];
}

// 三角形分割
// 凹多角形には未対応
function polygonToTriangles(polygon: readonly XY[]): Triangle[] {
    const triangles: Triangle[] = [];

    let index = 0;
    for (let i = 0; i < polygon.length; ++i) {
        const p0 = polygon[(i+polygon.length-1)%polygon.length];
        const p1 = polygon[i];
        const p2 = polygon[(i+1)%polygon.length];
        const p = crossProduct(p0, p1, p2);
        if (p < 0) {
            index = i;
            break;
        }
    }

    const p1 = polygon[index];
    for (let i = 2; i < polygon.length; ++i) {
        const j = index + i;
        const p2 = polygon[(j - 1) % polygon.length];
        const p3 = polygon[j % polygon.length];
        triangles.push([p1, p2, p3]);
    }
    return triangles;
}

// 三角形分割して面積を求める
function calculatePolygonSquare(polygon: XYArray) {
  const triangles = polygonToTriangles(polygon);
  let square = 0;
  for (const triangle of triangles) {
    const [p1, p2, p3] = triangle;
    square += Math.abs(crossProduct(p1, p2, p3));
  }
  return square * 0.5;
}

function calculateTriangleSquare(triangle: Triangle) {
  const [p1, p2, p3] = triangle;
  return Math.abs(crossProduct(p1, p2, p3)) * 0.5;
}

function crossProduct(p1: XY, p2: XY, p3: XY): number {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;

  const v1x = x2 - x1;
  const v1y = y2 - y1;
  const v2x = x3 - x1;
  const v2y = y3 - y1;
  return v1x * v2y - v1y * v2x;
}

function isInsideTriangle(triangle: Triangle, point: XY): boolean {
  // 三角形を構成する頂点を取り出します
  const [p1, p2, p3] = triangle;

  // 引数で与えた点から順に辺を引き、左側にあるかどうかを判定します
  const isLeft1 = crossProduct(p1, p2, point) >= 0;
  const isLeft2 = crossProduct(p2, p3, point) >= 0;
  const isLeft3 = crossProduct(p3, p1, point) >= 0;
  // 引数で与えた点が全ての辺の左側にある場合は、三角形の内部にあると判定します
  return isLeft1 && isLeft2 && isLeft3;
}

function isInsidePolygonTriangles(triangles: Triangle[], point: XY): boolean {
    for (const triangle of triangles) {
        if (isInsideTriangle(triangle, point)) {
            return true;
        }
    }
    return false;
}

export {
    GridAngles,
    polygonToTriangles,
    polygonToPolyline,
    isInsideTriangle,
    isInsidePolygonTriangles,
    toBounds,
    getDirection,
    transformPolyline, transformPolylines,
    createRectanglePolygon, crossProduct,
    mergePolylinesLayer,
    calculatePolygonSquare,
    GridAngleLabels,
    WEST, NORTH, EAST, SOUTH,
};

export type { GridAngle, XY, XYArray, TransFunc, Triangle, PolylinesLayer };