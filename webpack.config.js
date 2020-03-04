const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');

module.exports = (env, args) => {
	let production = false;

	if (args && args.mode === 'production') {
		production = true;
		console.log('== Production mode');
	} else {
		console.log('== Development mode');
	}


	return {
		entry: {
			'scripts/main': './src/index.ts',
		},
		output: {
			path: path.resolve('./dist'),
		},
		target: 'web',
		devtool: production ? false : 'source-map',
		optimization: {
			splitChunks: {
				// always create vendor.js
				cacheGroups: {
					d3: {
						test: /node_modules\/(d3)/,
						name: 'scripts/d3',
						chunks: 'initial',
						enforce: true,
					},
					vendor: {
						test: /node_modules\/(?!d3)/,
						name: 'scripts/vendor',
						chunks: 'initial',
						enforce: true,
					},
				},
			},
		},
		resolve: {
			mainFields: ['module', 'main'],
			extensions: ['.ts', '.tsx', '.js', '.html', '.txt'],
		},
		module: {
			rules: [{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [{
						loader: 'ts-loader'
					}],
				},
				{
					test: /\.css$/i,
					use: [
					  "style-loader",
					  "@teamsupercell/typings-for-css-modules-loader",
					  {
						loader: "css-loader",
						options: { modules: true }
					  }
					]
				  }
			],
		},
		devServer: {
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			contentBase: './dist',
			compress: true,
			port: 3030,
		},
		plugins: [
			new ForkTsCheckerWebpackPlugin(),
			new CopyWebpackPlugin([{
				from: '**/*',
				context: './api-mocks/'
			}, ]),
			new HtmlWebpackPlugin({
				template: 'src/index.ejs'
			}),
			new HtmlWebpackPlugin({
				template: 'src/static/map.html',
				filename: 'map.html'
			}),
			new BundleAnalyzerPlugin({
				analyzerMode: 'static'
			})
		],
	};
};
