const d = require("download");
const fs = require("fs");

function download(downloadUrl, downloadPath) {
  return new Promise((resolve, reject) => {
    d(downloadUrl)
      .pipe(fs.createWriteStream(downloadPath))
      .on("finish", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

exports.download = download;
