/**
 * Transforme un array d'IDs en mentions utilisables par sendMessage
 */
function formatMentions(participants) {
  return participants.map(id => ({ id }));
}

module.exports = { formatMentions };
