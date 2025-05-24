const fs = require('fs');
const membresFile = './membres.json';
module.exports = {
  name: 'list',
  description: 'Liste les membres du groupe.',
  async execute(client, message) {
    const membres = JSON.parse(fs.readFileSync(membresFile));
    if (membres.length === 0) return await client.sendMessage(message.from, { text: 'Aucun membre enregistré.' });
    const list = membres.map(m => `${m.pseudo} (${m.nom})`).join('\n');
    await client.sendMessage(message.from, { text: `Membres :\n${list}` });
  }
};
