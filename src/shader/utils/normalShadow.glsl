vec3 normalShadow(vec3 light, vec3 nor, float minBrightness) {
    vec3 lightDirection = normalize(light);
    float c = minBrightness + max(0.0, dot(normalize(nor), lightDirection)) * 0.1;
    vec3 shadowColor = vec3(c);
    return shadowColor;
}

#pragma glslify: export(normalShadow)
