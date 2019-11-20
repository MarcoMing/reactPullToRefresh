
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config');

const compiler = webpack(webpackConfig);

const server = new webpackDevServer(compiler,{
  contentBase: './dist',
  hot:true,
})

server.listen(8280,'localhost',function(){

})
