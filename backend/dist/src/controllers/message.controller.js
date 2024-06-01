import prisma from '../db/prisma.js';
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                },
            },
        });
        //IF CONVERSATION DOESN'T EXIST, CREATING NEW CONVERSATION
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId],
                    },
                },
            });
        }
        // CREATING NEW MESSAGE
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        // ADDING MESSAGE TO CONVERSATION
        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }
        //SOCKET IO
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log('Error in sendMessage: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId],
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
        // IF NO CONVERSATION SEND EMPTY ARRAY
        if (!conversation) {
            return res.status(200).json([]);
        }
        // RESPOND WITH CONVERSATION
        res.status(200).json(conversation.messages);
    }
    catch (error) {
        console.log('Error in sendMessage: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getUsersForSidebar = async (req, res) => {
    try {
        const authUserId = req.user.id;
        const users = await prisma.user.findMany({
            where: {
                id: { not: authUserId },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.log('Error in sendMessage: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
