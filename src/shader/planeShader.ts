export const planeFractShader = `
    uniform float uTime;
    uniform vec2 uResolution;

    void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec3 circleColor = vec3(0.);
        
    //     float pt = distance(uv, vec2(.5));
    //     float pt = distance(uv, vec2(0.4)) + distance(uv, vec2(0.6));
    //     float pt = distance(uv, vec2(0.4)) * distance(uv, vec2(0.6));
        float pt = min(distance(uv, vec2(0.4)),distance(uv, vec2(0.6)));
    
        if (pt < .1) {
            circleColor = vec3(1.);
        }
    
        vec3 color = vec3(0.0);
        float d = 0.0;

        // Remap the space to -1. to 1.
        uv = uv * 2. - 1.;
        float t = sin(uTime);

        // Make the distance field
        d = length(abs(uv) - .2);
    //     d = length(min(abs(uv) - .3, 0.));
    //     d = length(max(abs(uv) - .3, 0.));
        color = vec3(fract((t + d) * 10.0));
    
        if ((uv.x > .195 && uv.x < .205) || (uv.y < -.195 && uv.y > -.205)) {
            color = vec3(1.000, 0.009, 0.152);
        }

        // Visualize the distance field

        gl_FragColor = vec4(color, 1.0);
    }
`;

export const snowShader = `
    uniform float uTime;
    uniform vec2 uResolution;

    float PI = 3.1415;

    float polar(vec2 st, vec2 center) {
        // 获取极坐标和距离
        vec2 pos = center - st;
        return atan(pos.y, pos.x);
    }

    vec3 snow(vec2 st, vec2 center) {
        float a = polar(st, center) + uTime;

        float f;
        // f = cos(a*10.);
        // f = abs(cos(a*3.));
        // f = abs(cos(a*2.5))*.5+.3;
        f = abs(cos(a * 12.) * sin(a * 3.)) * .8 + .1;
        // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

        return vec3(1. - smoothstep(f, f + .5 + abs(sin(uTime)), length(center - st) * 5.));
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
        float rad = .05;
        float tangle = uTime * PI * 20.;
        float wy = .5 + rad * sin(tangle * PI / 180.);
        float wx = .5 + rad * cos(tangle * PI / 180.);

        vec3 color = snow(
            uv,
            vec2(wx, wy)
        );

        gl_FragColor = vec4(color, color.x);
    }
`;

export const colorZKShader = `
    float PI = 3.1415;

    uniform float uTime;
    uniform vec2 uResolution;

    varying vec2 vUv;
    varying vec3 vPosition;

    vec2 rotate2D (vec2 _st, float _angle) {
        _st -= 0.5;
        _st =  mat2(cos(_angle),-sin(_angle),
                    sin(_angle),cos(_angle)) * _st;
        _st += 0.5;
        return _st;
    }

    vec2 tile (vec2 _st, float _zoom) {
        _st *= 2.;
        _st *= _zoom;

        float index = 0.0;
        index += step(1., mod(_st.x, 2.));
        index += step(1., mod(_st.y, 2.)) * 2.;

        if (index == 0.) {
            _st = rotate2D(_st, PI / 2.);
        } else if (index == 3.) {
            _st = rotate2D(_st, PI / 2.);
        }
        return fract(_st);
    }

    vec2 rotateTilePattern(vec2 _st, float zoom){
        //  Scale the coordinate system by 2x2
        _st *= 2.0;

        //  Give each cell an index number
        //  according to its position
        float index = 0.0;
        index += step(1., mod(_st.x,2.0));
        index += step(1., mod(_st.y,2.0)) * 2.0;

        //      |
        //  2   |   3
        //      |
        //--------------
        //      |
        //  0   |   1
        //      |

        // Make each cell between 0.0 - 1.0
        _st = fract(_st);

        // Rotate each cell according to the index
        // if(index == 1.0){
        //     //  Rotate cell 1 by 90 degrees
        //     _st = rotate2D(_st,PI*0.5);
        // } else if(index == 2.0){
        //     //  Rotate cell 2 by -90 degrees
        //     _st = rotate2D(_st,PI*-0.5);
        // } else if(index == 3.0){
        //     //  Rotate cell 3 by 180 degrees
        //     _st = rotate2D(_st,PI);
        // }
        if (index == 0.) {
            _st = rotate2D(_st, PI * .5);
        } else if (index == 1.) {
            _st = rotate2D(_st, 2. * PI);
        } else if (index == 3.) {
            _st = rotate2D(_st, PI * -.5);
        } else {
            _st = rotate2D(_st, PI);
        }

        return _st;
    }

    void main (void) {
        vec2 st = gl_FragCoord.xy / vUv.xy;

        float zoom = 5.;
        st = tile(st,zoom);
        st = rotateTilePattern(st, zoom);

        // Make more interesting combinations
        // st = tile(st,2.0);
        // st = rotate2D(st,-PI*uTime*0.25);
        // st = rotateTilePattern(st*2.);
        // st = rotate2D(st,PI*uTime*0.25);

        // step(st.x,st.y) just makes a b&w triangles
        // but you can use whatever design you want.
        gl_FragColor = vec4(vec3(step(st.x,st.y)),1.0);
    }
`;
