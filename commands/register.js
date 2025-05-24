const fs = require('fs');
const membresFile = './membres.json';
module.exports = {
  name: 'register',
  description: 'Enregistre un utilisateur.',
  async execute(client, message, args) {
    const [pseudo, nom] = args;
    if (!pseudo || !nom) return await client.sendMessage(message.from, { text: 'Usage : !register <pseudo> <nom>' });
    const membres = JSON.parse(fs.readFileSync(membresFile));
    const exists = membres.find(m => m.chatId === message.from);
    if (exists) return await client.sendMessage(message.from, { text: 'Déjà enregistré.' });
    membres.push({ pseudo, nom, phone: message.from.replace('@c.us',''), chatId: message.from });
    fs.writeFileSync(membresFile, JSON.stringify(membres, null, 2));
    await client.sendMessage(message.from, { text: 'Enregistré !' });
  }
};
