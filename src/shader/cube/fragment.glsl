#pragma glslify:fresnel=require(../utils/fresnel.glsl)

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

float calcAO(vec3 pos,vec3 nor){
    float occ=0.;
    float sca=1.;
    for(int i=0;i<5;i++)
    {
        float h=.01+.12*float(i)/4.;
        // float d = map( pos + h*nor ).x;
        float d=1.;
        occ+=(h-d)*sca;
        sca*=.95;
        if(occ>.35)break;
    }
    return clamp(1.-3.*occ,0.,1.)*(.5+.5*nor.y);
}

void main(){
    vec3 color=uBaseColor;
    
    // AO
    float occ=max(.45,calcAO(vPos,vNormal));
    
    // amb
    float amb=clamp(.5+.5*vNormal.y,0.,1.);
    vec3 ambColor=vec3(amb*occ);
    
    // lig
    vec3 lightDirection=normalize(vLight);
    float c=.65+max(0.,dot(normalize(vNormal),lightDirection))*.6;
    vec3 shadowColor=vec3(c)*occ;
    
    // 材质贴图
    vec3 texture1=texture2D(uDisplacementMap1,vUv).rgb;
    vec3 texture2=texture2D(uDisplacementMap2,vUv).rgb;
    vec3 texture3=texture2D(uDisplacementMap3,vUv).rgb;
    vec3 texture=texture1+texture2+texture3;
    
    float F=fresnel(.12,3.6,6.,vEyeVector,vNormal)*occ;
    
    vec3 finalColor=color*shadowColor;
    
    float distance=distance(vec2(0.),uMouse);
    
    gl_FragColor=vec4(finalColor+F,.25+distance);
}
