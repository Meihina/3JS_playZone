varying vec2 vUv;// 坐标信息
varying vec3 vNormal;// 法线信息
varying vec3 vPos;// pos
varying vec3 vWorldPosition;// 世界坐标
varying vec3 vLight;
varying vec3 vEyeVector;

uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseSpeed;

const float PI=3.141592653;

vec3 lightPosition=vec3(8.,8.,8.);

mat4 rotation3dMatrix(vec3 axis,float angle){
    axis=normalize(axis);
    float s=sin(angle);
    float c=cos(angle);
    float oc=1.-c;
    
    return mat4(
        oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
        oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
        oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
        0.,0.,0.,1.
    );
}

vec3 rotate(vec3 v,vec3 axis,float angle){
    mat4 m=rotation3dMatrix(axis,angle);
    return(m*vec4(v,1.)).xyz;
}

vec3 getEyeVector(mat4 modelMat,vec3 pos,vec3 camPos){
    vec4 worldPosition=modelMat*vec4(pos,1.);
    vec3 eyeVector=normalize(worldPosition.xyz-camPos);
    return eyeVector;
}

// easings 方法
float qinticInOutAbs(float x){
    return x<.5?2.*x*x:1.-pow(-2.*x+2.,2.)/2.;
}

void main(){
    vec3 roPos=position;
    vec3 roNormal=normal;
    
    float t=uTime*2.;
    t=mod(t,20.25);
    float offsetZ=(t-position.z)/4.5;
    
    if(offsetZ>=.5&&offsetZ<1.5){
        offsetZ-=.5;
        roPos=rotate(position,vec3(0.,0.,1.),qinticInOutAbs(offsetZ)*2.*PI);
        roNormal=rotate(normal,vec3(0.,0.,1.),qinticInOutAbs(offsetZ)*2.*PI);
    }
    
    float offsetX=(t-position.x)/4.5;
    if(offsetX>=2.&&offsetX<=3.){
        offsetX-=2.;
        roPos=rotate(position,vec3(1.,0.,0.),qinticInOutAbs(offsetX)*2.*PI);
        roNormal=rotate(normal,vec3(1.,0.,0.),qinticInOutAbs(offsetX)*2.*PI);
    }
    
    float offsetY=(t-position.y)/4.5;
    if(offsetY>=3.5&&offsetY<=4.5){
        offsetY-=3.5;
        roPos=rotate(position,vec3(0.,1.,0.),qinticInOutAbs(offsetY)*2.*PI);
        roNormal=rotate(normal,vec3(0.,1.,0.),qinticInOutAbs(offsetY)*2.*PI);
    }
    
    roPos=rotate(roPos,vec3(uMouse,1.),uTime*PI/2.);
    roNormal=rotate(roNormal,vec3(uMouse,1.),uTime*PI/2.);
    
    vec3 pos=roPos;
    
    vec4 worldPosition=modelMatrix*vec4(pos,1.);
    vWorldPosition=worldPosition.xyz;
    gl_PointSize=0.;
    gl_Position=projectionMatrix*viewMatrix*worldPosition;
    
    vUv=uv;
    vNormal=roNormal;// 获得法线向量
    vPos=pos;
    vLight=lightPosition;
    vEyeVector=getEyeVector(modelMatrix,pos,cameraPosition);
}
