// rollup.config.js
// commonjs
import postcss from 'rollup-plugin-postcss';
var common = require('./rollup.js');


module.exports = {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        // When export and export default are not used at the same time, set legacy to true.
        // legacy: true,
        banner: common.banner,
    },
    external: ['react', 'react-dom'],
    globals: ['react', 'react-dom'],
    plugins: [
        postcss({
            //modules: true,
            extract: true,
            extensions: ['.scss']
        }),
        common.getCompiler()
    ]
};
