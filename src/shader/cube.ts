export const cubeVertexShader = `
    varying vec2 vUv; // 坐标信息
    varying vec3 vNormal; // 法线信息
    varying vec3 vPos; // pos
    varying vec3 vWorldPosition; // 世界坐标
    varying vec3 vLight;
    varying vec3 vEyeVector;

    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uMouseSpeed;

    const float PI = 3.141592653;

    vec3 lightPosition = vec3(8., 8., 8.);

    mat4 rotation3dMatrix(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;

        return mat4(
            oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
            0.0,                                0.0,                                0.0,                                1.0
        );
    }

    vec3 rotate(vec3 v, vec3 axis, float angle){
        mat4 m = rotation3dMatrix(axis, angle);
        return(m * vec4(v, 1.)).xyz;
    }

    vec3 getEyeVector(mat4 modelMat,vec3 pos,vec3 camPos){
        vec4 worldPosition=modelMat*vec4(pos,1.);
        vec3 eyeVector=normalize(worldPosition.xyz-camPos);
        return eyeVector;
    }

    // easings 方法
    float qinticInOutAbs(float x){
        return x < 0.5 ? 2. * x * x : 1. - pow(-2. * x + 2., 2.) / 2.;
    }

    void main(){
        vec3 roPos = position;
        vec3 roNormal = normal;

        float t = uTime * 2.;
        t = mod(t, 20.25);
        float offsetZ = (t - position.z) / 4.5;

        if (offsetZ >= .5 && offsetZ < 1.5) {
            offsetZ -= .5;
            roPos = rotate(position, vec3(0.,0.,1.), qinticInOutAbs(offsetZ) * 2. * PI);
            roNormal = rotate(normal, vec3(0.,0.,1.), qinticInOutAbs(offsetZ) * 2. * PI);
        }

        float offsetX = (t - position.x) / 4.5;
        if (offsetX >= 2. && offsetX <= 3.) {
            offsetX -= 2.;
            roPos = rotate(position, vec3(1.,0.,0.), qinticInOutAbs(offsetX) * 2. * PI);
            roNormal = rotate(normal, vec3(1.,0.,0.), qinticInOutAbs(offsetX) * 2. * PI);
        }

        float offsetY = (t - position.y) / 4.5;
        if (offsetY >= 3.5 && offsetY <= 4.5) {
            offsetY -= 3.5;
            roPos = rotate(position, vec3(0.,1.,0.), qinticInOutAbs(offsetY) * 2. * PI);
            roNormal = rotate(normal, vec3(0.,1.,0.), qinticInOutAbs(offsetY) * 2. * PI);
        }

        roPos = rotate(roPos, vec3(uMouse,1.), uTime * PI / 2.);
        roNormal = rotate(roNormal, vec3(uMouse,1.), uTime * PI / 2.);

        vec3 pos = roPos;

        vec4 worldPosition = modelMatrix * vec4(pos, 1.);
        vWorldPosition = worldPosition.xyz;
        gl_PointSize = 0.;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;

        vUv = uv;
        vNormal = roNormal; // 获得法线向量
        vPos = pos;
        vLight = lightPosition;
        vEyeVector = getEyeVector(modelMatrix, pos, cameraPosition);
    }
`;

export const cubeFragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 vWorldPosition;
    varying vec3 vLight;
    varying vec3 vEyeVector;

    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform sampler2D uDisplacementMap1;
    uniform sampler2D uDisplacementMap2;
    uniform sampler2D uDisplacementMap3;

    float calcAO(vec3 pos, vec3 nor ) {
        float occ = 0.0;
        float sca = 1.0;
        for( int i=0; i<5; i++ )
        {
            float h = 0.01 + 0.12*float(i)/4.0;
            // float d = map( pos + h*nor ).x;
            float d = 1.;
            occ += (h-d)*sca;
            sca *= 0.95;
            if( occ>0.35 ) break;
        }
        return clamp( 1.0 - 3.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.y);
    }

    // 菲涅尔
    float fresnel(float bias, float scale, float power, vec3 I, vec3 N) {
        return bias + scale * pow(1. + dot(I, N), power);
    }

    void main() {
        vec3 color = uBaseColor;

        // AO
        float occ = max(0.45, calcAO(vPos, vNormal));

        // amb
        float amb = clamp(0.5 + 0.5 * vNormal.y, 0., 1.);
        vec3 ambColor = vec3(amb * occ);

        // lig
        vec3 lightDirection = normalize(vLight);
        float c = 0.65 + max(0.0, dot(normalize(vNormal), lightDirection)) * 0.6;
        vec3 shadowColor = vec3(c) * occ;

        // 材质贴图
        vec3 texture1 = texture2D(uDisplacementMap1, vUv).rgb;
        vec3 texture2 = texture2D(uDisplacementMap2, vUv).rgb;
        vec3 texture3 = texture2D(uDisplacementMap3, vUv).rgb;
        vec3 texture = texture1 + texture2 + texture3;

        float F = fresnel(0.12, 3.6, 6., vEyeVector, vNormal) * occ;

        vec3 finalColor = color  * shadowColor;

        float distance = distance(vec2(0.), uMouse);

        gl_FragColor = vec4(finalColor + F, .25 + distance);
    }
`;
