import P5 from 'p5';
// import PingFang from '../assets/PingFang-Jian-ChangGuiTi-2.ttf';

export class funnelAnalyzeP5 {
    contain: HTMLElement;
    s: P5;

    constructor (contain: HTMLElement) {
        this.contain = contain;
        this.s = new P5(sketch, this.contain);
    }
}

export const sketch = (p: P5): void => {
    let myFont: any;
    const list = ['中台建联线索数', '中台建联线索数', '中台建联线索数', '中台建联线索数', '中台建联线索数', '中台建联线索数', '周活作者数'];

    p.preload = function () {
        // myFont = p.loadFont(PingFang);
    };

    p.setup = function () {
        p.createCanvas(876, 401);
        p.textFont('PingFangSC');
    };

    p.draw = function () {
        p.background(255, 255, 255);

        {
            const r = 50;
            const offX = 32;
            const offY = 8;
            linesDraw(
                2,
                [
                    { arcX: offX + r, arcY: offY + r, h: 2 * r, w: 2 * r, startAngle: p.PI, endAngle: p.PI + p.HALF_PI },
                    { arcX: offX + r, arcY: offY + 364 - r, h: 2 * r, w: 2 * r, startAngle: p.HALF_PI, endAngle: p.PI }
                ],
                [
                    { x1: 72 + offX, y1: offY, x2: offX + r, y2: offY },
                    { x1: offX, y1: offY + r, x2: offX, y2: offY + 364 - r }
                ]
            );
        }

        // barDraw();
        textDraw();
    };

    const textDraw = () => {
        const initPos = { x: 229, y: 15 };
        const diff = 60.5;

        for (const idx in list) {
            p.fill(0, 0, 0);
            p.textSize(13);
            p.textStyle(p.NORMAL);
            p.textAlign(p.RIGHT);
            p.smooth();
            p.text(list[idx], initPos.x, initPos.y + diff * Number(idx));

            p.fill('#307DF0');
            p.noStroke();
            p.rect(245, 6 + diff * Number(idx), 280, 20, 2);
        }
    };

    const linesDraw = (
        weight: number,
        arcs: Record<string, number>[],
        lines: Record<string, number>[]
    ) => {
        p.noFill();
        p.stroke('#F2F2F2');
        p.strokeWeight(weight);

        for (const line of lines) {
            const { x1, y1, x2, y2 } = line;
            p.line(x1, y1, x2, y2);
        }

        for (const line of arcs) {
            const { arcX, arcY, h, w, startAngle, endAngle } = line;
            p.arc(arcX, arcY, h, w, startAngle, endAngle);
        }
    };
};
