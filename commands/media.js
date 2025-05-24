const { MessageMedia } = require('whatsapp-web.js');
module.exports = {
  name: 'media',
  description: 'Renvoie un média.',
  async execute(client, message) {
    const media = await MessageMedia.fromUrl('https://placekitten.com/200/300');
    await client.sendMessage(message.from, { media });
  }
};
