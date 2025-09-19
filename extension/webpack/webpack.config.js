const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	mode: 'production',
	entry: {
		types: path.resolve(__dirname, '..', 'src', 'types.ts'),
		popup: path.resolve(__dirname, '..', 'src', 'popup.ts'),
		setup: path.resolve(__dirname, '..', 'src', 'setup.ts'),
	},
	output: {
		path: path.join(__dirname, '../dist'),
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: '.', to: '.', context: 'public' }],
		}),
		new HtmlWebpackPlugin({
			title: 'Path Jerry to Ez Template',
			template: './src/popup.html',
			filename: 'popup.html',
			inject: false,
		}),
	],
};
