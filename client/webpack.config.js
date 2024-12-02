const path = require('path');

module.exports = {
    // Loyihaning kirish nuqtasi
    entry: './src/index.js', // Bu faylni o'zingizning loyihangizga moslang

    // Chiqish sozlamalari
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // Bu faylni o'zingizning loyihangizga moslang
    },

    // Modullarni topish sozlamalari
    resolve: {
        fallback: {
            "url": require.resolve("url/"),
            // Boshqa polyfill kerak bo'lsa, shu yerga qo'shing
        },
    },

    // Boshqa sozlamalar
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};
