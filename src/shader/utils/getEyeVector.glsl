vec3 getEyeVector(mat4 modelMat, vec3 pos, vec3 camPos) {
    vec4 worldPosition = modelMat * vec4(pos, 1.);
    vec3 eyeVector = normalize(worldPosition.xyz - camPos);
    return eyeVector;
}

#pragma glslify: export(getEyeVector)
