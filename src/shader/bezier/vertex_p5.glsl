precision highp float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vUv;
varying vec2 vPos;

void main() {
    vUv = aTexCoord;
    vPos = (gl_Position = vec4(aPosition,1.0)).xy;
}
