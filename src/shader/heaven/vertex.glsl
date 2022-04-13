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
    vec3 pointDirect = normalize(p);
    
    vec3 directDimension1 = pointDirect * 2.5;
    vec3 timeDimension1 = vec3(uTime);
    float noise1 = snoise(directDimension1 + timeDimension1);
    
    vec3 directDimension2 = pointDirect * 1.5;
    vec3 timeDimension2 = vec3(uTime) * 1.5;
    float noise2 = snoise(directDimension2 + timeDimension2);
    
    float noise = noise1 * noise2;
    vec3 displacement = pointDirect * (noise + length(p));
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
