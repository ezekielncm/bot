const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs").promises;
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth()
});
client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.initialize();
// Listening to all incoming messages
client.on("message_create", async (msg) => {
  const name = await msg.getContact();
  const chat = await msg.getChat();
  console.log(`${name.pushname} de ${chat.id.user}:`, msg.body);
});
client.on("message_create", (message) => {
  if (message.body === "!ping") {
    // send back "pong" to the chat the message was sent in
    client.sendMessage(message.from, "pong");
  }
});
client.on("message_create", (message) => {
  if (message.body === "!menu") {
    // reply back "pong" directly to the message
    message.reply("****menu****\n->command\n!menu\n!tagall\n!register\n!list");
  }
});
client.on("message", async (msg) => {
  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
  }
});
client.on("message", async (msg) => {
  if (msg.body === "!media") {
    const media = new MessageMedia("image/png", base64Image);
    await client.sendMessage(msg.from, media);
  }
});
client.on("message", async (msg) => {
  const mentions = await msg.getMentions();

  for (let user of mentions) {
    console.log(`${user.pushname} was mentioned`);
  }
});
// client initialization...

client.on("message_create", async (msg) => {
  try {
    const chat = await msg.getChat();
    const user = await msg.getContact();
    if (msg.body === "!tagall") {
      if (chat.isGroup) {
        let text = `${user.id.user}:${user.pushname} vous a tagger\n`;
        let mentions = [];
        for (let participant of chat.participants) {
          mentions.push(`${participant.id.user}@c.us`);
          text += `@${participant.id.user}\n`;
        }

        await chat.sendMessage(text, { mentions });
      } else {
        console.log(
          "Message non envoyé : le message ne fait pas partie d'un groupe"
        );
        msg.reply("le message ne fait pas partie d'un groupe");
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    throw new Error("Échec de l'envoi du message");
  }
});
async function mentionnerTousLesMembres(chat) {
  try {
    const participants = await chat.getParticipants();
    const mentions = participants.map(
      (participant) => `@${participant.id.user}`
    );
    const message = `Salut à tous ! ${mentions.join(" ")}`;

    await chat.sendMessage(message);
    console.log("Message envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
  }
}
client.on("message_create", async (msg) => {
  if (msg.body === "!hidetag") {
    // reply back "pong" directly to the message
    const chat = await msg.getChat();
  }
});
async function registrer(data) {
  try {
    // Lire le fichier JSON existant
    const existingData = await fs.readFile("membres.json", "utf8");
    const parsedData = JSON.parse(existingData);

    // Ajouter le nouvel enregistrement à la structure de données
    parsedData.push(data);

    // Écrire les données modifiées dans le fichier
    await fs.writeFile("membres.json", JSON.stringify(parsedData, null, 2));

    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    throw new Error("Échec de l'enregistrement");
  }
}

async function chargerMembres() {
  try {
    const data = await fs.readFile("membres.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Erreur de syntaxe JSON:", error);
    } else {
      console.error("Erreur lors du chargement :", error);
    }
    throw new Error("Échec du chargement");
  }
}
async function recherchermenbre(criter, valeur) {
  try {
    const membres = await chargerMembres();
    return membres.filter((membre) => membre[criter] === valeur);
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    throw new Error("Échec de la recherche");
  }
}
client.on("message", async (msg) => {
  try {
    if (msg.body.startsWith("!register")) {
      const data = msg.body.split(" ");
      if (data.length < 3) {
        return msg.reply("Usage :!register pseudo nom");
      }
      const pseudo = data[1];
      const nom = data[2];
      const userphone = msg.getContact();
      const msgchat = msg.getChat();
      let chat = (await msgchat).id.user;
      let phone = (await userphone).id.user;
      const user = await recherchermenbre("phone", phone);
      if (user.length > 0 && user[0].chat==chat ) {
        let mes = `Ce numero est déjà utilisé\n${phone},pseudo:"${user[0].pseudo}",nom:"${user[0].nom}"`;
        return await msg.reply(mes);
      }
      const ondata = {
        pseudo,
        nom,
        phone,
        chat
      };
      await registrer(ondata);
      return msg.reply("Enregistrement réussi");
    }
  } catch (error) {
    console.error("Erreur client :", error);
    throw new Error("Échec client");
  }
});
client.on("message_create", async (msg) => {
  try {
    if (msg.body.startsWith("!list")) {
      const data = await chargerMembres();
      const msgchat = msg.getChat();
      let chat = (await msgchat).id.user;
      let mes = "Liste des membres :\n";
      for (let i = 0; i < data.length; i++) {
        if(data[i].chat==chat){
          mes += `${i + 1}. pseudo:"${data[i].pseudo}",nom:"${data[i].nom}"\n`;
        }
      }
      return await msg.reply(mes);
    }
  } catch (error) {
    console.error("Erreur client :", error);
    throw new Error("Échec client");
  }
});
