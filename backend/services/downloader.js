const youtubedl = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs');

class DownloaderService {
  async getYoutubeAudio(url, outputDir) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      // Get video info to get ID
      const info = await youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: ['referer:youtube.com', 'user-agent:googlebot']
      });

      const videoId = info.id;
      const outputPath = path.join(outputDir, `${videoId}.mp3`);

      // Download audio
      await youtubedl(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        output: path.join(outputDir, `${videoId}.%(ext)s`),
      });

      return outputPath;
    } catch (error) {
      console.error("Error in YouTube download:", error);
      return null;
    }
  }
}

module.exports = new DownloaderService();
