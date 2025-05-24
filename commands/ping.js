module.exports = {
  name: 'ping',
  description: 'Répond pong.',
  async execute(client, message) {
    await client.sendMessage(message.from, { text: 'pong' });
  }
};
