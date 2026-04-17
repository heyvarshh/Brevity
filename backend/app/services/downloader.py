import os
import yt_dlp
from typing import Optional

class DownloaderService:
    @staticmethod
    def get_youtube_audio(url: str, output_path: str) -> Optional[str]:
        """
        Downloads the best audio from a YouTube URL and converts it to mp3.
        Returns the path to the downloaded file.
        """
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': f'{output_path}/%(id)s.%(ext)s',
            'quiet': True,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                return f"{output_path}/{info['id']}.mp3"
        except Exception as e:
            print(f"Error downloading YouTube audio: {e}")
            return None

downloader_service = DownloaderService()
