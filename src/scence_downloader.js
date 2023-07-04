const fs = require("fs");
const path = require("path");
const download = require("download");
const { CDN_URL } = require("./config");
const allScenes = require("../assets/scene_pages.json").scenes;

const NEED_DOWNLOAD = false;
const UPLOAD_CDN_PATH = `${CDN_URL}/scenes`;

let sceneSources = [];
const sceneFiles = fs.readdirSync(
  path.resolve(__dirname, "../assets/source/scenes")
);
sceneFiles.forEach((file) => {
  if (file.endsWith(".json")) {
    const fileContent = require(`../assets/source/scenes/${file}`);
    if (fileContent.items instanceof Array) {
      sceneSources.push(...fileContent.items);
    }
  }
});

sceneSources = sceneSources.map((sceneSource) => {
  const sceneInfo = allScenes.find(
    (scene) => scene.id === sceneSource.scene_id
  );
  return {
    name: sceneInfo.name,
    sub_title: sceneInfo.sub_title,
    description: sceneInfo.description,
    simple_tags: sceneInfo.simple_tags,
    primary_color: sceneInfo.primary_color,
    is_dolby: !!sceneInfo.resource.dolby_hash,
    video_cover_url: sceneInfo.video_cover_url,
    video_cover_demo_url: sceneInfo.video_cover_demo_url,
    image: sceneInfo.image,
    ...sceneSource,
  };
});

if (NEED_DOWNLOAD) {
  const DOWNLOAD_PATH = path.resolve(__dirname, "../downloads/");
  sceneSources.forEach((source) => {
    const id = source.scene_id;
    const imgUrl = source.image;
    const videoCoverUrl = source.video_cover_url;
    const videoUrl = source.video_cover_demo_url;
    const soundUrl = source.resource_download_url;

    // 创建文件夹
    const scenePath = path.resolve(DOWNLOAD_PATH, `./scenes/${id}`);
    if (!fs.existsSync(scenePath)) {
      fs.mkdirSync(scenePath);
    }
    // 下载文件
    imgUrl &&
      download(imgUrl).pipe(fs.createWriteStream(`${scenePath}/image.jpg`));
    videoCoverUrl &&
      download(videoCoverUrl).pipe(
        fs.createWriteStream(`${scenePath}/video_cover.jpg`)
      );
    videoUrl &&
      download(videoUrl).pipe(fs.createWriteStream(`${scenePath}/video.mp4`));
    soundUrl &&
      download(soundUrl).pipe(fs.createWriteStream(`${scenePath}/sound.mp3`));
  });
}

const cpSceneSources = JSON.parse(JSON.stringify(sceneSources));
cpSceneSources.forEach((source) => {
  source.image &&
    (source.image = `${UPLOAD_CDN_PATH}/${source.scene_id}/image.jpg`);
  source.video_cover_url &&
    (source.video_cover_url = `${UPLOAD_CDN_PATH}/${source.scene_id}/video_cover.jpg`);
  source.resource_download_url &&
    (source.resource_download_url = `${UPLOAD_CDN_PATH}/${source.scene_id}/sound.mp3`);
  source.video_cover_demo_url &&
    (source.video_cover_demo_url = `${UPLOAD_CDN_PATH}/${source.scene_id}/video.mp4`);
  source.video_cover_download_url &&
    (source.video_cover_download_url = `${UPLOAD_CDN_PATH}/${source.scene_id}/video.mp4`);
});
const sceneSourcesJson = JSON.stringify(cpSceneSources, null, 2);
fs.writeFileSync(
  path.resolve(__dirname, "../downloads/scenes/sources.json"),
  sceneSourcesJson
);
