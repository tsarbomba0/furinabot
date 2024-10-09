export type MusicPlayerRegex = {
    sc_track: RegExp
    sc_playlist: RegExp
    sp_track: RegExp
    sp_playlist: RegExp
    yt_track: RegExp
    yt_playlist: RegExp
}

export const RegexList: MusicPlayerRegex = {
    sc_track: /https:\/\/soundcloud\.com\/\w+\/.+/gmi,
    sc_playlist: /(https:\/\/soundcloud.com\/.+\/sets\/.+)/gmi,
    sp_track: /https:\/\/open\.spotify\.com\/album/gmi,
    sp_playlist: /https:\/\/open\.spotify\.com\/track/gmi,
    yt_track: /https:\/\/(www|music)\.youtube\.com\/watch\?v=\w+\b[^&]/gmi,
    yt_playlist: /https:\/\/www\.youtube\.com\/watch\?v=\w+&list=.+/gmi
}
