module.exports = {
    // 部署到github
    publicPath: process.env.NODE_ENV === 'production' ? '/3JS_Page' : '/',
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.(glsl|vs|fs|vert|frag)$/,
                    exclude: /node_modules/,
                    use: [
                        'raw-loader',
                        'glslify-loader'
                    ]
                }
            ]
        }
    }
};
