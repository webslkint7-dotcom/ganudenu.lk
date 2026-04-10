import fs from 'fs';
import path from 'path';

/**
 * Saves a Base64 encoded image string to the physical 'uploads' folder.
 * @param {string} base64String - The full Data URL (e.g., data:image/jpeg;base64,...)
 * @returns {string|null} - The relative path to the saved file (e.g., 'uploads/img_uuid.jpg') or null if invalid.
 */
export const saveBase64Image = (base64String) => {
  if (!base64String || !base64String.startsWith('data:image')) return null;

  try {
    const uploadsDir = path.resolve('uploads');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Extract file extension and base64 data
    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    // Create unique filename without external dependencies
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `img_${uniqueSuffix}.${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file
    fs.writeFileSync(filePath, buffer);

    // Return the relative path for database storage
    return `uploads/${fileName}`;
  } catch (err) {
    console.error('File Upload Error:', err);
    return null;
  }
};
