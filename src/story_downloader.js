const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");
const { download } = require("./utils/download");
const allScenes = require("../assets/sleep_story_pages.json").sleep_stories;

const NEED_DOWNLOAD = JSON.parse(process.env.NEED_DOWNLOAD);
const UPLOAD_CDN_PATH = `${process.env.BOS_CDN_URL}/sleep_stories`;

async function main() {
  let sceneSources = [];
  const sceneFiles = fs.readdirSync(
    path.resolve(__dirname, "../assets/source/sleep_stories")
  );
  sceneFiles.forEach((file) => {
    if (file.endsWith(".json")) {
      const fileContent = require(`../assets/source/sleep_stories/${file}`);
      sceneSources.push(fileContent);
    }
  });

  sceneSources = sceneSources.map((sceneSource) => {
    const sceneInfo = allScenes.find(
      (scene) => scene.resources_v2[0].hash === sceneSource.hash
    );
    if (!sceneInfo)
      throw new Error(`找不到对应的资源，请更新 sleep_story_pages.json，hash：${sceneSource.hash}`);
    return {
      id: sceneInfo.id,
      name: sceneInfo.name,
      sub_title: sceneInfo.sub_title,
      description: sceneInfo.description,
      simple_tags: sceneInfo.simple_tags,
      primary_color: sceneInfo.primary_color,
      is_dolby: !!sceneInfo.resources_v2.dolby_hash,
      video_cover_url: sceneInfo.video_cover_url,
      video_cover_demo_url: sceneInfo.video_cover_demo_url,
      image: sceneInfo.image,
      ...sceneSource,
    };
  });

  if (NEED_DOWNLOAD) {
    const DOWNLOAD_PATH = path.resolve(__dirname, "../downloads/");
    for (let i = 0; i < sceneSources.length; i++) {
      const source = sceneSources[i];
      const id = source.id;
      const imgUrl = source.image;
      const videoCoverUrl = source.video_cover_url;
      const videoUrl = source.video_cover_demo_url;
      const soundUrl = source.url;

      // 创建文件夹
      const scenePath = path.resolve(DOWNLOAD_PATH, `./sleep_stories/${id}`);
      if (!fs.existsSync(scenePath)) {
        fs.mkdirSync(scenePath);
      } else {
        console.log(`${id} 资源已存在，无需下载`);
        continue;
      }
      // 下载文件
      console.log(`正在下载, id: ${source.id}`);
      await Promise.all(
        [
          imgUrl && download(imgUrl, `${scenePath}/image.jpg`),
          soundUrl && download(soundUrl, `${scenePath}/sound.mp3`),
          videoCoverUrl &&
            download(videoCoverUrl, `${scenePath}/video_cover.jpg`),
          videoUrl && download(videoUrl, `${scenePath}/video.mp4`),
        ].filter((item) => !!item)
      );
      console.log(`下载完成, id: ${source.id}`);
    }
  }

  const cpSceneSources = JSON.parse(JSON.stringify(sceneSources));
  cpSceneSources.forEach((source) => {
    source.image &&
      (source.image = `${UPLOAD_CDN_PATH}/${source.id}/image.jpg`);
    source.url && (source.url = `${UPLOAD_CDN_PATH}/${source.id}/sound.mp3`);
    source.video_cover_url &&
      (source.video_cover_url = `${UPLOAD_CDN_PATH}/${source.id}/video_cover.jpg`);
    source.video_cover_demo_url &&
      (source.video_cover_demo_url = `${UPLOAD_CDN_PATH}/${source.id}/video.mp4`);
  });
  const sceneSourcesJson = JSON.stringify(cpSceneSources, null, 2);
  fs.writeFileSync(
    path.resolve(__dirname, "../downloads/sleep_stories/sources.json"),
    sceneSourcesJson
  );

  console.log("=====================\n数据处理成功:");
  cpSceneSources.forEach((source) => {
    console.log(`id: ${source.id}, name: ${source.name["zh-Hans"]}`);
  });
  console.log(`总计：${cpSceneSources.length} 条资源`);
}

main();
