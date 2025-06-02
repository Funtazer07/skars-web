const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
    return process.env.CLOUDINARY_CLOUD_NAME && 
           process.env.CLOUDINARY_API_KEY && 
           process.env.CLOUDINARY_API_SECRET;
};

// Get photos by category
router.get('/photos/:category', async (req, res) => {
    try {
        if (!isCloudinaryConfigured()) {
            console.error('Cloudinary is not configured. Please check your .env file.');
            return res.status(500).json({ 
                error: 'Cloudinary configuration is missing',
                details: 'Please check your .env file for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET'
            });
        }

        const { category } = req.params;
        console.log('Fetching photos for category:', category);
        
        // Log the search expression
        const searchExpression = `folder:skars-web/${category}`;
        console.log('Cloudinary search expression:', searchExpression);
        
        const result = await cloudinary.search
            .expression(searchExpression)
            .sort_by('created_at', 'desc')
            .max_results(100)
            .execute();

        console.log('Cloudinary search result:', JSON.stringify(result, null, 2));

        if (!result.resources) {
            console.log('No resources found for category:', category);
            return res.json([]);
        }

        const photos = result.resources.map(resource => ({
            url: resource.secure_url,
            public_id: resource.public_id,
            category: category
        }));

        console.log('Returning photos:', photos);
        res.json(photos);
    } catch (error) {
        console.error('Detailed error in /photos/:category:', {
            message: error.message,
            stack: error.stack,
            category: req.params.category
        });
        res.status(500).json({ 
            error: error.message,
            details: 'Error fetching photos from Cloudinary'
        });
    }
});

// Get all photos route
router.get('/photos', async (req, res) => {
    try {
        if (!isCloudinaryConfigured()) {
            console.error('Cloudinary is not configured. Please check your .env file.');
            return res.status(500).json({ 
                error: 'Cloudinary configuration is missing',
                details: 'Please check your .env file for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET'
            });
        }

        console.log('Fetching all photos');
        
        const result = await cloudinary.search
            .expression('folder:skars-web/*')
            .sort_by('created_at', 'desc')
            .max_results(100)
            .execute();

        console.log('Cloudinary search result:', result);

        // Organize photos by category
        const photosByCategory = {
            concerts: [],
            events: [],
            nightlife: []
        };

        if (result.resources) {
            result.resources.forEach(resource => {
                const category = resource.folder ? resource.folder.split('/')[1] : 'uncategorized';
                if (photosByCategory[category]) {
                    photosByCategory[category].push({
                        url: resource.secure_url,
                        public_id: resource.public_id,
                        category: category
                    });
                }
            });
        }

        console.log('Returning photos by category:', photosByCategory);
        res.json(photosByCategory);
    } catch (error) {
        console.error('Detailed error in /photos:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: error.message,
            details: 'Error fetching all photos from Cloudinary'
        });
    }
});

// Single file upload route
router.post('/single', upload.single('image'), async (req, res) => {
    try {
        if (!isCloudinaryConfigured()) {
            return res.status(500).json({ 
                error: 'Cloudinary configuration is missing',
                details: 'Please check your .env file for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET'
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!req.body.category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        console.log('File upload details:', {
            originalname: req.file.originalname,
            category: req.body.category,
            path: req.file.path,
            cloudinaryUrl: req.file.url
        });

        res.json({
            message: 'File uploaded successfully',
            file: req.file,
            category: req.body.category
        });
    } catch (error) {
        console.error('Error uploading single file:', error);
        res.status(500).json({ error: error.message });
    }
});

// Multiple files upload route
router.post('/multiple', upload.array('images', 5), async (req, res) => {
    try {
        if (!isCloudinaryConfigured()) {
            return res.status(500).json({ 
                error: 'Cloudinary configuration is missing',
                details: 'Please check your .env file for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        if (!req.body.category) {
            return res.status(400).json({ error: 'Category is required' });
        }
        res.json({
            message: 'Files uploaded successfully',
            files: req.files,
            category: req.body.category
        });
    } catch (error) {
        console.error('Error uploading multiple files:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get random photos for portfolio
router.get('/latest', async (req, res) => {
    try {
        if (!isCloudinaryConfigured()) {
            console.error('Cloudinary is not configured');
            return res.status(500).json({ error: 'Cloudinary configuration is missing' });
        }

        const result = await cloudinary.search
            .expression('folder:skars-web/*')
            .max_results(5)
            .execute();

        if (!result.resources || result.resources.length === 0) {
            return res.json([]);
        }

        const photos = result.resources.map(resource => ({
            url: resource.secure_url,
            category: resource.folder ? resource.folder.split('/')[1] : 'uncategorized'
        }));

        res.json(photos);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ error: 'Failed to fetch photos' });
    }
});

module.exports = router; 