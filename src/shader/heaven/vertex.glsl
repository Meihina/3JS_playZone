#pragma glslify: snoise = require(glsl-noise/simplex/3d)
#pragma glslify: getEyeVector = require(../utils/getEyeVector)

varying vec2 vUv; // 坐标信息
varying vec3 vNormal; // 法线信息
varying vec3 vPos; // pos
varying vec3 vWorldPosition; // 世界坐标
varying vec3 vLight;
varying vec3 vEyeVector;

uniform float uTime;

const float PI = 3.141592653;
vec3 lightPosition = vec3(80., 80., 80.);

vec3 displace(vec3 p) {
    vec3 pointDirection = normalize(p);
    
    vec3 n11 = pointDirection * 2.5;
    vec3 n12 = vec3(uTime);
    float noise1 = snoise(n11 + n12);
    
    vec3 n21 = pointDirection * 1.5;
    vec3 n22 = vec3(sin(uTime)) * 1.5;
    float noise2 = snoise(n21 + n22);
    
    float noise = noise1 * noise2;
    vec3 displacement = pointDirection * (noise + length(p));
    return displacement;
}

#pragma glslify: fixNormal = require('../utils/fixNormal', distort = displace)

void main(){
    vec3 pos = displace(position);

    vec4 worldPosition = modelMatrix * vec4(pos, 1.);
    vWorldPosition = worldPosition.xyz;
    gl_PointSize = 0.;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
    
    vUv = uv;
    vNormal = fixNormal(position,pos,normal); // 获得法线向量
    vPos = pos;
    vLight = lightPosition;
    vEyeVector = getEyeVector(modelMatrix, position, cameraPosition);
}
