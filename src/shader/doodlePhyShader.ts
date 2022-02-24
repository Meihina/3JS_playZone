export const doodlePhyFragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution;
        gl_FragColor = vec4(abs(sin(u_time)), st.x, st.y, 1.);
    }
`;

export const doodlePhyVertexShader = `
    uniform float u_size;

    void main(){
        vec4 modelPosition = modelMatrix * vec4(position, 1.);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        gl_PointSize *= (u_size / -viewPosition.z);
    }
`;
