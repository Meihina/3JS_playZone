precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uCurrentPoint;

vec2 twoBezier(float t, vec2 p1, vec2 p2, vec2 cp) {
    float x = (1. - t) * (1. - t) * p1.x + 2. * t * (1. - t) * cp.x + t + t * p2.x;
    float y = (1. - t) * (1. - t) * p1.y + 2. * t * (1. - t) * cp.y + t + t * p2.y;
    return vec2(x, y);
}

// float plotSmoothStepY(vec2 st, float pct) {
//     return smoothstep(pct - 4., pct - 2., st.y) - smoothstep(pct + 2., pct + 4., st.y);
// }

float lineCircle(vec2 st, float radius, vec2 center) {
    vec2 dist = st - center;
	return 1. - smoothstep(0., radius * 2., dot(dist, dist) * 4.0);
}

void main() {
    vec4 color = vec4(0.);
    // 转化坐标于 220 * 70 的画布内，方便理解
    vec2 st = vec2(vUv.x * 220., vUv.y * 70.);

    const int POINTSNUM = 150;
    vec2 points[150];

    // 生成复数个点
    for (int i = 0; i < POINTSNUM; i++) {
        float t = 1. / float(POINTSNUM) * (float(i) + 1.);
        vec2 point = twoBezier(
            t,
            vec2(0., 60.),
            vec2(210., 10.),
            vec2(60., 60.)
        );
        points[i] = vec2(point.x, 70. - point.y);
    }

    // 以点作圆
    vec4 circleColor;
    for (int i = 0; i < POINTSNUM; i++) {
        circleColor += vec4(lineCircle(st, 30., points[i]));
    }

    // 单通道值最大不过1，避免颜色变异
    circleColor = vec4(
        min(circleColor.x, 1.),
        min(circleColor.y, 1.),
        min(circleColor.z, 1.),
        min(circleColor.w, 1.)
    );

    vec4 fadeColor = vec4(1.000, st.x / 220., 0.034, 1.);

    // 颜色变化
    if (st.x < uCurrentPoint.x) {
        circleColor *= vec4(1.000, 1., 0.034, 1.) * fadeColor;
    }

    vec4 finalColor = circleColor;

    gl_FragColor = finalColor;
}