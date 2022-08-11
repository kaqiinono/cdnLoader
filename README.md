```js
// webpack示例
{
                    test: /\.s?css$/,
                    include,
                    exclude: /node_modules/,
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader', // 不要更换顺序，否则行内注释不生效
                            options: {
                                postcssOptions: {
                                    plugins: [['postcss-preset-env']]
                                }
                            }
                        },
                        {
                            loader: 'cdn-change-loader',
                            options: {
                                cdnServerPath:
                                    'https://cdn.com',
                                assetsPath: path.resolve(
                                    __dirname,
                                    `../packages/${packageName}`
                                ),
                                uploadFile: file =>
                                    uploadAssetsFile( // 自定义上传函数，返回promise，返回结果为相对路径
                                        file,
                                        null,
                                        'datamill-static',
                                        'dm-menu/assets'
                                    )
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
```
