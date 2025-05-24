module.exports = {
  name: 'menu',
  description: 'Affiche la liste des commandes disponibles.',
  async execute(client, message) {
    const cmds = Array.from(client.commands.keys()).join(', ');
    await client.sendMessage(message.from, { text: `Commandes : ${cmds}` });
  }
};
