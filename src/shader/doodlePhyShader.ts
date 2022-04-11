export const doodlePhyFragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution;
        gl_FragColor = vec4(abs(sin(u_time)), st.x, st.y, 1.);
    }
`;

export const specShader = `
    uniform float uTime;
    uniform vec2 uResolution;

    float PI = 3.1415;

    float plot(vec2 st, float pct){
        return smoothstep( pct-0.02, pct, st.y) - smoothstep( pct, pct+0.02, st.y);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        
        float scaleSize = 4. + cos(uTime * 3.);

        float wy = sin((uv.x + uTime * 0.5) * PI) / scaleSize + 0.5;
        
        float pct = plot(uv, wy);
        
        vec3 backGround = vec3(0., 0., 0.);
        vec3 lColor = vec3(1.000, 0.835, 0.314) * pct;
        
        gl_FragColor = vec4(backGround + lColor, 1.);
    }
`;
