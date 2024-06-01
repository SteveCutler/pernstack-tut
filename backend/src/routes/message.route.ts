import express from 'express'
const router = express.Router()
import protectRoute from '../middleware/protectRoute.js'
import {
    sendMessage,
    getMessages,
    getUsersForSidebar,
} from '../controllers/message.controller.js'

router.get('/conversations', protectRoute, getUsersForSidebar)
router.get('/:id', protectRoute, getMessages)
router.post('/send/:id', protectRoute, sendMessage)

export default router
