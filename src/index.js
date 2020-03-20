//
// sharp-image-webpack-loader
//
// Copyright (c) 2018 José Massada <jose.massada@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import path from 'path';
import loaderUtils from 'loader-utils';
import sharp from 'sharp';

export default function loader(src) {
  this.cacheable();

  const options = loaderUtils.getOptions(this) || {};
  if (this.resourceQuery) {
    Object.assign(options, loaderUtils.parseQuery(this.resourceQuery));
  }

  let transformer = sharp(src);
  if (options.format) {
    const newPathPieces = path.parse(this.resourcePath);
    const originalFormat = newPathPieces.ext;
    const newPath = path.format({
      dir: newPathPieces.dir,
      name: newPathPieces.name,
      ext: `.${options.format}`,
    });
    this.resourcePath = newPath;
    if(options.format === 'webp') {
      transformer = transformer.webp({
        lossless: originalFormat === '.png',
        reductionEffort: 6,
      });
    } else {
      transformer = transformer.toFormat(options.format);
    }
  }
  Object.assign(transformer.options, options);

  return transformer.toBuffer(this.async());
}

export const raw = true;
