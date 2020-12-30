// ==================================================
// Simpacker 用 manifest.json 出力 Node.js スクリプト
// 基本の使い方：node output_manifest_js.js public
// ==================================================
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
// default ignore Path
const DEFAULT_IGNORE_PATH = 'public';
// default manifest.json path
const DEFAULT_OUTPUT_MANIFEST_PATH = 'public/packs/manifest.json';
// Cache Bustring String Source
const S = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
// Number of Cache Bustring String
const N = 6;

// Check args
function showUsageAndExit() {
  const basename = path.basename(process.argv[1]);
  console.error(`Usage: node ${basename} <target directory path> <optionla:ignore path> <optional:manifest.json path>`);
  process.exit(1);
}

const getFiles = (dirpath, callback) => {
  fs.readdir(dirpath, {withFileTypes: true}, (err, dirents) => {
    if (err) {
      console.error(err);
      return;
    }

    for (const dirent of dirents) {
      const fp = path.join(dirpath, dirent.name);
      if (dirent.isDirectory()) {
        getFiles(fp, callback);
      } else if (ignorePath === dirpath) {
        // public ディレクトリ直下は処理対象外
        continue;
      } else if (fp === outputManifestPath) {
        // マニフェストファイルそのものは処理対象外
        continue;
      } else {
        cacheBustringString = Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n)=>S[n%S.length]).join('');
        outputObject[dirent.name] = `${fp.replace(ignorePath, '')}?v=${cacheBustringString}`;
        callback(fp);
      }
    }
  });
}

// process.argv[0] : Node.jsの実行プロセスのフルパス
// process.argv[1] : スクリプトファイルのフルパス
// なので3番目以降をargsに取り出す
const args = process.argv.slice(2);
if (args.length < 1) {
  showUsageAndExit();
}

if (args.length < 2) {
  args.push(DEFAULT_OUTPUT_MANIFEST_PATH);
  args.push(DEFAULT_IGNORE_PATH);
}

if (args.length < 3) {
  args.push(DEFAULT_IGNORE_PATH);
}

const checkPath = args[0];
const outputManifestPath = args[1];
const ignorePath = args[2];
const outputObject = {};
getFiles(checkPath, console.log);

// getFiles の処理が終わり切ってから実行するために setTimeout
// Promise化すれば getFiles を同期実行できそう……
setTimeout(console.log, 500, `wait: output ${outputManifestPath} ...`);
setTimeout(()=>{ fs.writeFileSync(outputManifestPath, JSON.stringify(outputObject, null, 2)); }, 510);
