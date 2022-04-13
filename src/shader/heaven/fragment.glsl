#pragma glslify: fresnel = require(../utils/fresnel.glsl)
#pragma glslify: normalShadow = require(../utils/normalShadow.glsl)

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vWorldPosition;
varying vec3 vLight;
varying vec3 vEyeVector;

uniform float uTime;
uniform vec3 uBaseColor;
// uniform vec2 uResolution;
// uniform vec2 uMouse;

vec2 opU( vec2 d1, vec2 d2 ) {
    return (d1.x < d2.x) ? d1 : d2;
}

float sdSphere( vec3 p, float s ) {
    return length(p) - s;
}

vec2 map(vec3 pos) {
    vec2 res = vec2(1e10, 0.0);

    res = opU( res, vec2( sdSphere(    pos-vec3(-2.0,0.25, 0.0), 0.25 ), 26.9 ) );

    return res;
}

#pragma glslify: calcAO = require('../utils/calcAO.glsl', map = map)

void main() {
    vec3 color = uBaseColor;

    // AO
    float occ = max(.9, calcAO(vPos, vNormal));

    // lig
    vec3 shadowColor = normalShadow(vLight, vNormal, .65);

    float F = fresnel(0.1, 1.6, 6., vEyeVector, vNormal);

    vec3 finalColor = color * shadowColor;

    gl_FragColor = vec4(finalColor + F, 1);
}