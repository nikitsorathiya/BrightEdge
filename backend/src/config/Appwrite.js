import { Client, Storage, ID } from 'node-appwrite';
import fs from 'fs';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed
import FormData from 'form-data';
import { config } from 'dotenv';

config();

async function uploadToAppWrite(file) {
    const form = new FormData();
    form.append('fileId', 'unique()');
    form.append('file', fs.createReadStream(file.path));
  
    try {
      const response = await fetch(
        'https://cloud.appwrite.io/v1/storage/buckets/6ab37a2d003724496f34/files',
        {
          method: 'POST',
          headers: {
            'X-Appwrite-Project': '6ab26a3c00229b34072d',
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY, // truncated here for safety
            ...form.getHeaders(),
          },
          body: form,
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
  
      fs.unlinkSync(file.path); // cleanup
  
      const fileId = result.$id;
  
      return `https://cloud.appwrite.io/v1/storage/buckets/6ab37a2d003724496f34/files/${fileId}/view?project=6ab26a3c00229b34072d`;
  
    } catch (err) {
      console.error("❌ Upload Error:", err.message);
      return null;
    }
  }

export { uploadToAppWrite };