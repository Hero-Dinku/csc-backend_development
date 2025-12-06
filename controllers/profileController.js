const accountModel = require('../models/accountModel');
const path = require('path');
const fs = require('fs');

const showProfilePictureForm = (req, res) => {
    try {
        res.render('account/profile-picture', {
            title: 'Update Profile Picture',
            user: req.user,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Profile picture form error:', error);
        res.status(500).render('error', { message: 'Server error' });
    }
};

const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.files || !req.files.profilePicture) {
            return res.render('account/profile-picture', {
                title: 'Update Profile Picture',
                user: req.user,
                error: 'Please select a file',
                success: null
            });
        }

        const profilePicture = req.files.profilePicture;
        const userId = req.user.account_id;
        
        // Validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(profilePicture.mimetype)) {
            return res.render('account/profile-picture', {
                title: 'Update Profile Picture',
                user: req.user,
                error: 'Only JPG, PNG, and GIF files are allowed',
                success: null
            });
        }
        
        if (profilePicture.size > maxSize) {
            return res.render('account/profile-picture', {
                title: 'Update Profile Picture',
                user: req.user,
                error: 'File size must be less than 5MB',
                success: null
            });
        }
        
        // Create uploads directory
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Generate unique filename
        const fileExtension = path.extname(profilePicture.name);
        const fileName = \`profile_\${userId}_\${Date.now()}\${fileExtension}\`;
        const filePath = path.join(uploadDir, fileName);
        
        // Save file
        await profilePicture.mv(filePath);
        
        // Update database
        const pictureUrl = \`/uploads/\${fileName}\`;
        await accountModel.updateProfilePicture(userId, pictureUrl);
        
        res.render('account/profile-picture', {
            title: 'Update Profile Picture',
            user: { ...req.user, profile_picture_url: pictureUrl },
            error: null,
            success: 'Profile picture updated successfully!'
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.render('account/profile-picture', {
            title: 'Update Profile Picture',
            user: req.user,
            error: 'Upload failed: ' + error.message,
            success: null
        });
    }
};

module.exports = {
    showProfilePictureForm,
    uploadProfilePicture
};
