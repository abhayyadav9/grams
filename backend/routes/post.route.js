// backend/routes/post.routes.js
import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js'; // Auth middleware
import upload from '../middleware/multer.js'; // Multer middleware for file uploads
import {
    addComment,
    addNewPost,
    bookmarkPost,
    deletePost,
    dislikePost,
    getAllPost,
    getCommentsOfPost,
    getUserPost,
    likePost,
} from '../controllers/post.controller.js';

// Initialize the router
const router = express.Router();

// Define the routes
router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/all').get(isAuthenticated, getAllPost);
router.route('/userpost/all').get(isAuthenticated, getUserPost);
router.route('/:id/like').get(isAuthenticated, likePost);
router.route('/:id/dislike').get(isAuthenticated, dislikePost);
router.route('/:id/comment').post(isAuthenticated, addComment);
router.route('/:id/comment/all').post(isAuthenticated, getCommentsOfPost);
router.route('/delete/:id').delete(isAuthenticated, deletePost);
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost);

// Export the router to be used in the main app
export default router;
