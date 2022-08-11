const fs = require('fs');
const path = require('path');
const { getOptions } = require('loader-utils');

function escapeRegExp(string) {
  return string.replace(/"|'/, `'`).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceSourceFile(originFile, from, to) {
  const originContent = fs.readFileSync(originFile).toString();
  const writeData = originContent.replace(new RegExp(escapeRegExp(from).replace(/("|')/g, '.'), 'g'), to);
  fs.writeFileSync(originFile, writeData);
}

function replaceCDN(str) {
  const MATCH_REG = /url\((?!"?'?http).*?\/assets\/.*?\)/g;
  const match = str.match(MATCH_REG);
  const originFile = this.resourcePath;
  const { cdnServerPath, assetsPath, uploadFile } = getOptions(this);

  if (match && match.length) {
    for (let m of match) {
      const as = m
        ?.match(/assets\/.*?\)/)[0]
        ?.replace(`'`, '')
        ?.replace(`"`, '')
        .slice(0, -1);
      uploadFile(path.join(assetsPath, as), null).then(relativePath => {
        const finalUrl = `url('${cdnServerPath && cdnServerPath.endsWith('/') ? '' : '/'}${relativePath}')`;
        replaceSourceFile(originFile, m, finalUrl);
      });
    }
    return fs.readFileSync(originFile).toString();
  }

  return str;
};

module.exports = replaceCDN;
