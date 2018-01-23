/* globals $ */
;(function (window) {
  'use strict'
  var playlist = {}
  window.SNDTST = {
    init: function (id, assetHost, then) {
      $('#jplayer_1').jPlayer({
        ready: function () {
          playlist.dom = $(id)
          playlist.tracks = {}
          $('li', playlist.dom).each(function () {
            var track = $(this).data('song')
            playlist.tracks[track] = {
              oga: assetHost + track + '.ogg',
              mp3: assetHost + track + '.mp3'
            }
          }).on('click', function () {
            window.SNDTST.play($(this).data('song'))
          }).addClass('jp-playable')
          then()
        },
        swfPath: '/static/js',
        supplied: 'oga, mp3'
      }).on($.jPlayer.event.play, function () {
        var currentTrack = $('li[data-song=' + $(this).data('current-track') + ']')
        $('.jp-playing-track').removeClass('jp-playing-track')
        currentTrack.addClass('jp-playing-track')
        $('.jp-title').html(currentTrack.data('title'))
      })
    },
    play: function (track) {
      var selected = track
      if (typeof selected === 'undefined') {
        selected = $($('li', playlist.dom)[0]).data('song')
      }
      $('#jp_container_1').fadeIn()
      $('#jplayer_1').data('current-track', selected).jPlayer('setMedia', playlist.tracks[selected]).jPlayer('play')
    }
  }
})(window)
