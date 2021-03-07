const {google} = require('googleapis');
const path = require('path');
const fs = require('fs');
const { file } = require('googleapis/build/src/apis/file');

//Generate API Keys under https://console.cloud.google.com/
const CLIENT_ID = 'someclientid.apps.googleusercontent.com';
const CLIENT_SECRET = 'someclientsecret';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = 'somerefreshtoken';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

const filePath = path.join(__dirname, 'flower.jpg');

async function uploadfile() {
    try{
        const response = await drive.files.create({
            requestBody: {
                name: 'flower_image.jpg',
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath)
            }
        });

        console.log(response.data);
    }
    catch (error) {
        console.log(error.message);
    }
}

async function deleteFile(fileId) {
    try{
        const response = await drive.files.delete({
            fileId: fileId
        });

        console.log(response.data, response.status);
    }
    catch (error) {
        console.log(error.message);
    }
}

async function generatePublicUrl(fileId) {
    try{
        const response = await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
            
        });

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        })

        console.log(result.data);
    }
    catch (error) {
        console.log(error.message);
    }
}

//Uncomment to Enable
//uploadfile();
//generatePublicUrl('1MqcLeYaNfBiyNSdLFo0BrgsVXgxyXfQj');
//deleteFile('1MqcLeYaNfBiyNSdLFo0BrgsVXgxyXfQj');
