module.exports = {
    soundcloud_playlist_regex: /(https:\/\/soundcloud.com\/.+\/sets\/.+)/gmi ,
    soundcloud_track_regex: /https:\/\/soundcloud\.com\/\w+\/.+/gmi ,

    spotify_playlist_regex: /https:\/\/open\.spotify\.com\/playlist/gmi ,
    spotify_track_regex: /https:\/\/open\.spotify\.com\/playlist/gmi ,

    youtube_playlist_regex: /https:\/\/www\.youtube\.com\/watch\?v=\w+&list=.+/gmi ,
    youtube_track_regex: /https:\/\/(www|music)\.youtube\.com\/watch\?v=\w+\b[^&]/gmi ,
}