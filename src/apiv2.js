require('dotenv').config();

const apiKey = process.env.API_KEY;

const {
    google
} = require('googleapis');
const ytService = google.youtube({
    version: 'v3',
    auth: apiKey
});


const getVideoId = async (params) => {
    try {
        const {
            data: {
                items
            }
        } = await ytService.search.list({
            part: ["snippet"],
            q: params,
            maxResults: 1,

        });
        return {
            videoId : await items[0].id.videoId
        };
    } catch (error) {
        return { error : 'music not found'}
    }
}

module.exports = {
    getVideoId
}