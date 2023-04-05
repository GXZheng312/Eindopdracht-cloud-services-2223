subscribeToTopic('user', 'auth.user.get', async (message) => {
    const userId = message.userId;
    const user = { id: userId, name: 'John Doe' };
    await publishToExchange('user', `user.product.get.${userId}`, user);
});