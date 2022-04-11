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

vec2 opU( vec2 d1, vec2 d2 )
{
    return (d1.x<d2.x) ? d1 : d2;
}


float sdSphere( vec3 p, float s ) {
    return length(p)-s;
}

vec2 map(vec3 pos) {
    vec2 res = vec2(1e10, 0.0);

    {
        res = opU( res, vec2( sdSphere(    pos-vec3(-2.0,0.25, 0.0), 0.25 ), 26.9 ) );
    }

    return res;
}

float calcAO(vec3 pos, vec3 nor) {
    float occ = 0.0;
    float sca = 1.0;
    for( int i = 0; i < 5; i++ )
    {
        float h = 0.01 + 0.12 * float(i)/4.0;
        float d = map( pos + h * nor ).x;
        // float d = 1.;
        occ += (h - d) * sca;
        sca *= 0.95;
        if(occ > 0.35) break;
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
    float occ = max(.9, calcAO(vPos, vNormal));

    // lig
    vec3 lightDirection = normalize(vLight);
    float c = 0.65 + max(0.0, dot(normalize(vNormal), lightDirection)) * 0.1;
    vec3 shadowColor = vec3(c);

    float F = fresnel(0.1, 1.6, 6., vEyeVector, vNormal);

    vec3 finalColor = color * shadowColor;

    gl_FragColor = vec4(finalColor + F, 1);
}