varying vec2 vUv; // 坐标信息
varying vec3 vPos; // pos

uniform float uTime;

void main(){
    gl_PointSize = 0.;
    vec4 worldPosition = modelMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
    
    vUv = uv;
    vPos = position;
}
