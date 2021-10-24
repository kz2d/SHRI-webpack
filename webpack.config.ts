import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatoscopePlugin from '@statoscope/webpack-plugin';

import ModuleLogger from './plugins/moduleLogger';
import { WebpackDeduplicationPlugin } from 'webpack-deduplication-plugin';

const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        root: './src/pages/root.tsx',
        root2: './src/pages/root2.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new ModuleLogger('src', { exclude: ['index.html'] }),
        // new webpack.NormalModuleReplacementPlugin(/.*\/bn.js/, 'Alnode_modules/bn.js'),
        // new WebpackDeduplicationPlugin({ cacheDir: 'cache', rootPath: null }),
        new StatoscopePlugin({
            saveStatsTo: 'stats.json',
            saveOnlyStats: false,
            open: false,
        }),
    ],
    resolve: {
        fallback: {
            'buffer': require.resolve('buffer'),
            'stream': false,
        },
        extensions: ['.ts', '.js'],
        alias: {
            'crypto-browserify': path.resolve(__dirname, 'src/utils/uuid'),
            // Alnode_modules: path.resolve(__dirname, 'node_modules'),
        },
        modules: [path.resolve(__dirname, 'node_modules')],
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        usedExports: false,
    },
};

export default config;
