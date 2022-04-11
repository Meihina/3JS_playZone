export class Bezier {
    getPoints (pieces = 100, ...points: any[]): any[] {
        let func: any;
        switch (points.length) {
            case 2:
                func = this.oneBezier;
                break;
            case 3:
                func = this.twoBezier;
                break;
            default:
                func = this.threeBezier;
                break;
        }

        const resPoints = [];
        for (let i = 0; i < pieces; i++) {
            resPoints.push(func(i / pieces, ...points));
        }
        return resPoints;
    }

    /**
     * @desc 一阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     */
    oneBezier (
        t: number,
        p1: number[],
        p2: number[]
    ): number[] {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        return [x, y];
    }

    /**
     * @desc 二阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp 控制点
     */
    twoBezier (
        t: number,
        p1: number[],
        p2: number[],
        cp: number[]
    ): number[] {
        const [x1, y1] = p1;
        const [cx, cy] = cp;
        const [x2, y2] = p2;
        const x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        const y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [x, y];
    }

    /**
     * @desc 二阶贝塞尔反推控制点
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} p 当前点
     */
     twoBezier2CP (
        t: number,
        p1: number[],
        p2: number[],
        p: number[]
    ): number[] {
        const [x1, y1] = p1;
        const [x, y] = p;
        const [x2, y2] = p2;
        const cx = (x - (1 - t) * (1 - t) * x1 - t * t * x2) / (2 * t * (1 - t));
        const cy = (y - (1 - t) * (1 - t) * y1 - t * t * y2) / (2 * t * (1 - t));
        return [cx, cy];
    }

    /**
     * @desc 三阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp1 控制点1
     * @param {Array} cp2 控制点2
     */
     threeBezier (
        t: number,
        p1: number[],
        p2: number[],
        cp1: number[],
        cp2: number[]
    ): number[] {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const [cx1, cy1] = cp1;
        const [cx2, cy2] = cp2;
        const x =
            x1 * (1 - t) ** 3 +
            3 * cx1 * t * (1 - t) ** 2 +
            3 * cx2 * (1 - t) * t ** 2 +
            x2 * t ** 3;
        const y =
            y1 * (1 - t) ** 3 +
            3 * cy1 * t * (1 - t) ** 2 +
            3 * cy2 * (1 - t) * t ** 2 +
            y2 * t ** 3;
        return [x, y];
    }

    /**
     * @desc 三阶贝塞尔反推控制点2
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp1 控制点1
     * @param {Array} p 当前点
     */
     threeBezierCP2 (
        t: number,
        p1: number[],
        p2: number[],
        cp1: number[],
        p: number[]
    ): number[] {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const [cx1, cy1] = cp1;
        const [x, y] = p;
        const cx2 = (x - x1 * (1 - t) ** 3 - 3 * cx1 * t * (1 - t) ** 2 - x2 * t ** 3) / (3 * (1 - t) * t ** 2);
        const cy2 = (y - y1 * (1 - t) ** 3 - 3 * cy1 * t * (1 - t) ** 2 - y2 * t ** 3) / (3 * (1 - t) * t ** 2);
        return [cx2, cy2];
    }
}
