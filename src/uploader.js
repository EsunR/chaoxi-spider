const dotenv = require("dotenv");
dotenv.config();
const { BosClient } = require("@baiducloud/sdk");
const fg = require("fast-glob");
const path = require("path");

const config = {
  endpoint: process.env.BOS_ENDPOINT,
  credentials: {
    ak: process.env.BOS_AK,
    sk: process.env.BOS_SK,
  },
};
const client = new BosClient(config);
const bucket = process.env.BOS_BUCKET;

const NEED_REFRESH_FILE = ["sources.json"];

async function main() {
  const filePaths = fg.sync([path.join(__dirname, "../downloads/**/*")], {
    dot: false,
  });
  for (let filePath of filePaths) {
    const fileKey = filePath.replace(path.join(__dirname, "../downloads/"), "");
    if (!NEED_REFRESH_FILE.some((match) => fileKey.includes(match))) {
      try {
        const isExist = await client.getObjectMetadata(bucket, fileKey);
        if (isExist) {
          console.log(`资源已存在，已跳过，fileKey: ${fileKey}`);
          continue;
        }
      } catch (error) {
        console.log(`资源不存在，正在尝试上传`);
      }
    }
    await client.putObjectFromFile(bucket, fileKey, filePath);
    console.log(`上传成功，fileKey: ${fileKey}`);
  }
}

main();
