module.exports = {
  name: 'jomok',
  execute(message, args) {
    const jomokLevel = Math.floor(Math.random() * 100) + 1;
    message.reply(`🤣 Kamu ${jomokLevel}% jomok hari ini!`);
  }
};
