subscribeToTopic('user', 'auth.user.get', async (message) => {
    await publishToExchange('user', `user.auth.get.${message.username}`);
});