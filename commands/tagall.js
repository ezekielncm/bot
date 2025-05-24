module.exports = {
  name: 'tagall',
  description: 'Mentionne tous les participants.',
  async execute(client, message) {
    const chat = await message.getChat();
    const mentions = chat.participants.map(p => p.id._serialized);
    await client.sendMessage(message.from, {
      text: '@everyone',
      mentions: mentions.map(id => ({ id }))
    });
  }
};
