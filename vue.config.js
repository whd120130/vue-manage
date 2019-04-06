module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/sys':{
                target:'http://localhost:8080',
                ws:true,
                changeOrigin:true,
                pathRewrite:{
                    '^/sys':'http://localhost:8080'
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    }
}
