const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
  name: 'play',
  async execute(message, args) {
    if (!message.member.voice.channel) return message.reply('❗ Masuk voice channel dulu!');

    const url = args[0];
    if (!url) return message.reply('❗ Kasih link YouTube/Spotify-nya!');

    const stream = await playdl.stream(url);
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());

    message.reply(`🎵 Memutar: ${url}`);
  }
};
