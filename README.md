# Sleep Story

### 探索页面 - 睡眠故事列表

URL: /v2/explorer/sleep_story_pages/CN

### 故事详情页- 故事详情

> 必须进入故事详情页面点击播放后才会请求

URL: /v1/sleep_stories/{story_id}/resources/{guid}/download_url

URL query:

- audio_type: dolby

Response:

```json
{
	"url": "https://resources.tide.moreless.io/sleep_story/lqJXqHPEke3b5cF7h5Kz1so0UEgW?e=1689570693&token=u4tBlo_XwtYeHkdWvCHRDkdNP2JILjAlYKsXsauB:JMRQq2SDzzEwaWkx_jDgVXgFPu8=",
	"hash": "lqJXqHPEke3b5cF7h5Kz1so0UEgW",
	"audio_type": "stereo",
	"cover_video_url": "https://resources.tide.moreless.io/?e=1689570693&token=u4tBlo_XwtYeHkdWvCHRDkdNP2JILjAlYKsXsauB:RLnTZdxBmvjH9hejaUM6XXtzCns=",
	"cover_video_hash": "",
	"qiniu_edge_ips": ["60.220.196.224", "60.220.196.223"]
}
```
