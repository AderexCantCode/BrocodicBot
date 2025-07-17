const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
  name: 'play',
  async execute(message, args) {
    if (!message.member.voice.channel) return message.reply('❗ Masuk voice channel dulu!');

    const url = args[0];
    if (!url) return message.reply('❗ Kasih link YouTube/Spotify-nya!');

    let stream, resource;
    try {
      if (playdl.is_expired()) await playdl.refreshToken();
      if (playdl.yt_validate(url) === 'video') {
        // YouTube
        stream = await playdl.stream(url);
        resource = createAudioResource(stream.stream, { inputType: stream.type });
      } else if (playdl.sp_validate(url) === 'track') {
        // Spotify track
        const spotifyInfo = await playdl.spotify(url);
        if (spotifyInfo && spotifyInfo.name && spotifyInfo.artists && spotifyInfo.artists.length > 0) {
          // Search YouTube for the track
          const search = await playdl.search(`${spotifyInfo.name} ${spotifyInfo.artists[0].name}`, { limit: 1 });
          if (search && search.length > 0) {
            stream = await playdl.stream(search[0].url);
            resource = createAudioResource(stream.stream, { inputType: stream.type });
          } else {
            return message.reply('❗ Tidak dapat menemukan lagu di YouTube.');
          }
        } else {
          return message.reply('❗ Tidak dapat mengambil info lagu dari Spotify.');
        }
      } else {
        return message.reply('❗ Link tidak valid atau belum didukung.');
      }
    } catch (err) {
      console.error(err);
      return message.reply('❗ Terjadi kesalahan saat memutar lagu.');
    }

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
