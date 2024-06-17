# YouTube Playlist Downloader

This project is a Node.js application designed to download videos from a specified YouTube playlist in MP3 format. It leverages the YouTube Data API to fetch playlist items and the Real-Debrid API to unrestrict and download the video links.

## Features

- Fetches all video links from a given YouTube playlist.
- Unrestricts video links using the Real-Debrid API.
- Downloads videos in MP3 format.
- Supports retrying downloads in case of failure.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your system.
- An active Real-Debrid account and API token.
- A YouTube API key.

## Installation

1. Clone the repository to your local machine:
   `git clone https://github.com/your-username/youtube-playlist-downloader.git`
2. Navigate to the project directory:
   `cd youtube-playlist-downloader`
3. Install the required dependencies:
   `npm install`

## Configuration

Create a `.env` file in the root directory of the project and add your Real-Debrid token and YouTube API key:

```
REAL_DEBRID_TOKEN=your_real_debrid_token
YOUTUBE_API_KEY=your_youtube_api_key
```

## Usage
To start downloading videos from a YouTube playlist, run the following command in the terminal:
`node index.js`

By default, the script is set to download videos from a hardcoded playlist ID. To download videos from a different playlist, modify the getLinks function call at the bottom of the `index.js` file with your desired playlist ID.

MP3 files are downloaded to the `downloads/` directory

### Disclaimer
This tool is for educational purposes only. Please ensure you have the right to download and convert YouTube videos in your country.
