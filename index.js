require('dotenv').config()
const fs = require("fs");
const axios = require("axios");

const authToken = process.env.REAL_DEBRID_TOKEN
const baseUrl = "https://api.real-debrid.com/rest/1.0/";

const youtubeApi = process.env.YOUTUBE_API_KEY;

async function getLinks(playlistId) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${youtubeApi}`;
    let videoUrls;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            videoUrls = (data.items.map((item) => {
                return `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`;
            }));

            unrestrictLink(videoUrls);
        })
        .catch((error) => console.error("Error fetching playlist:", error));

}

async function unrestrictLink(links) {
    const formData = new FormData();
    const downloadLinks = [];
    const linkNames = [];

    const fetchPromises = links.map(async (link) => {
        formData.append("link", link);

        try {
            const response = await fetch(`${baseUrl}unrestrict/link`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });
            
            const data = await response.json();
            const fileName = data.alternative.filter(alt => alt.download.includes('.mp3'))[0].filename;
            const mp3Link = data.alternative.filter(alt => alt.download.includes('.mp3'))[0].download;
            downloadLinks.push(mp3Link);
            linkNames.push(fileName);
        } catch (error) {
            console.error("Error:", error);
        }
    });

    await Promise.all(fetchPromises);

    console.log(downloadLinks);

    downloadFile(downloadLinks, linkNames);
}

async function downloadFileWithRetry(link, name, retries = 5, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios({
                method: "GET",
                url: link,
                responseType: "stream",
            });
            response.data.pipe(fs.createWriteStream(`./downloads/${name}`));
            console.log(`File downloaded successfully: ${name} | ${link}`);
            break; // Exit the loop if download is successful
        } catch (error) {
            console.error(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt === retries) throw new Error(`Failed to download file after ${retries} attempts`);
            await new Promise(resolve => setTimeout(resolve, delay)); // Wait for a bit before retrying
        }
    }
}

async function downloadFile(links, names) {
    const downloadPromises = links.map((link, index) => {
        const name = names[index]; // Access the corresponding name using the index
        return downloadFileWithRetry(link, name); // Assuming downloadFileWithRetry can take a name as an argument
    });
    await Promise.all(downloadPromises);
}

// Add youtube playlist id here
getLinks('PLJvFII1uOsxBGP2iK4Lxy-cg8o1F189lW')

// Ex. https://youtube.com/playlist?list=PL6P_j9EDhOcSiGNWi7Jm39elD__7lCw8D&si=1kCmwOe9l7k4JiYY
// getLinks('PL6P_j9EDhOcSiGNWi7Jm39elD__7lCw8D')