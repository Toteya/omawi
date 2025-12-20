// Handles the interactive functionality of the music player / songs page
import {
  getSongMelody,
  getSongLyrics,
  filterSongsByComposer,
} from "../scripts/requests.js";

$(document).ready(() => {
  // Create audio context with Web Audio API to allow for audio manupulation
  let audioContext;
  let audioBuffers;
  let gainNodes;
  let sources = [];
  let startTime;
  let offsetTime;

  const playPause = $('#play-pause');
  const volumeControl = $('#volume-control');
  const progressBar = $('#progress-bar')[0];
  const currentTimeDisplay = $('#current-time')[0];
  const totalTimeDisplay = $('#total-time')[0];

  const muteSoprano = $('#mute-soprano')
  const muteAlto = $('#mute-alto')
  const muteTenor = $('#mute-tenor')
  const muteBass = $('#mute-bass')

  const muteButtons = [muteSoprano, muteAlto, muteTenor, muteBass];

  const audioSources = [
    $('#soprano').find('source'),
    $('#alto').find('source'),
    $('#tenor').find('source'),
    $('#bass').find('source'),
  ];

  async function initAudioContext() {
    return new Promise((resolve, reject) => {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext());
      } catch (error) {
        window.alert('Your browser does not support the Web Audio API.');
      }

      if (audioContext !== undefined) {
        (async() => {
          const paths = audioSources.map((audioSource) => audioSource.data('src'));
          // fetch data for each audio source file
          const dataBuffers = await Promise.all(
            paths.map( (path) => fetch( path ).then( (res) => res.arrayBuffer() ) )
          );
          // create audio buffers / decode the audio data
          audioBuffers = await Promise.all(
            dataBuffers.map( (buf) => audioContext.decodeAudioData( buf ) )
          );
          // gain nodes to allow mute/unmute individual tracks
          gainNodes = audioBuffers.map(() => audioContext.createGain());
        })().then(() => {
          offsetTime = 0;
          startTime = audioContext.currentTime
          resetPlayerUI();
          resolve();
        })
      } else {
        reject();
      }
    });
  }



  // control playing and pausing
  playPause.click(() => {
    if (audioContext === undefined) {
      return;
    }
    if(sources.length !== 0) {
      // normal play-pause control
      playPauseAll();
    } else {
      // enable the audioContext through a user gesture (button click)
      // decode audio and create buffer source(s)
      audioContext.resume().then(() => {
        offsetTime = 0;
        startPlayback();
        const icon = playPause.find('i');
        icon.removeClass('fa-play');
        icon.addClass('fa-pause');
      })
    }
  });

  const startPlayback = () => {
    const currentTime = audioContext.currentTime;
    // startTime = currentTime - offsetTime;
    startTime = currentTime;
    audioBuffers.forEach( (buf, index) => {
      const source = audioContext.createBufferSource();
      source.buffer = buf;
      source.connect(gainNodes[index]);
      gainNodes[index].connect(audioContext.destination);
      sources.push(source);
      $(source).on('ended', () => {
        // remove source from array / clear the sources array
        sources = sources.filter(s => s !== source);
        resetPlayerUI();
        // offsetTime = 0;  DO NOT UNCOMMENT THIS!!! It will break progress bar seeking
      })
      // start all audios after 0.5s just to be safe (to ensure they're in sync)
      source.start(currentTime + 0.5, offsetTime);
      requestAnimationFrame(updateProgressBar);
    });
  }

  const playPauseAll = () => {
    const icon = playPause.find('i');
    if (audioContext.state === 'running') {
      // PAUSE
      audioContext.suspend().then(() => {
        icon.removeClass('fa-pause');
        icon.addClass('fa-play');
      })
    } else if (audioContext.state === 'suspended') {
      // PLAY
      audioContext.resume().then(() => {
        requestAnimationFrame(updateProgressBar);
        icon.removeClass('fa-play');
        icon.addClass('fa-pause');
      })
    }
  }


  // volume control
  volumeControl.on('input propertychange', function() {
    adjustVolume($(this).val());
  })

  const adjustVolume = (value) => {
    gainNodes.forEach((node) => {
      node.gain.value = value;
    })
  }

  // progress bar
  function updateProgressBar() {
    const duration = audioBuffers[0].duration;
    let progressTime = audioContext.currentTime - startTime + offsetTime;
    if (progressTime < 0) progressTime = 0;

    const currentMinutes = Math.floor(progressTime / 60);
    const currentSeconds = Math.floor(progressTime % 60);
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);
  
    setTimeDisplay(currentTimeDisplay, currentSeconds, currentMinutes);
    setTimeDisplay(totalTimeDisplay, totalSeconds, totalMinutes);

    const progress = (progressTime / duration) * 100;
    progressBar.value = progress;
    if (progressTime < duration && audioContext.state === 'running') {
      requestAnimationFrame(updateProgressBar);
    }
  }

  const setTimeDisplay = (timeDisplay, seconds, minutes) => {
    timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  $('#progress-bar').on('input propertychange', function() {
    if (sources.length === 0) {
      return;
    }
    // cancelAnimationFrame(reqID);
    sources.forEach((source) => source.stop());
    const progress = $(this).val();
    const duration = audioBuffers[0].duration;
    offsetTime = (duration * progress) / 100;
    startPlayback(offsetTime);
  });

  // Initialise the PlayerUI / icons, progress bar, time
  const resetPlayerUI = () => {
    let duration;
    try {
      duration = audioBuffers[0].duration;
    } catch {
      duration = 0;
    }
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);    
    setTimeDisplay(currentTimeDisplay, 0, 0);
    setTimeDisplay(totalTimeDisplay, totalSeconds, totalMinutes);
    progressBar.value = 0;

    const icon = playPause.find('i');
    icon.removeClass('fa-pause');
    icon.addClass('fa-play');
  }
  resetPlayerUI();

  // control muting of individual or all tracks
  const toggleMute = (muteButton, gain) => {
    const icon = muteButton.find('i');
    const span = muteButton.find('span.icon')
    if (!gain.value) {
      unmuteAudio(icon, span, gain);
    } else {
      muteAudio(icon, span, gain);
    }
  }

  const muteAudio = (icon, span, gain) => {
    gain.value = 0;
    icon.removeClass('fa-volume-high');
    icon.addClass('fa-volume-xmark');
    span.addClass('has-text-danger')
  }

  const unmuteAudio = (icon, span, gain) => {
    gain.value = 1;
    icon.removeClass('fa-volume-xmark');
    icon.addClass('fa-volume-high');
    span.removeClass('has-text-danger')
  }

  $('#mute-soprano').click(() => {
    const gain = gainNodes[0].gain
    toggleMute(muteSoprano, gain);
  });

  $('#mute-alto').click(() => {
    const gain = gainNodes[1].gain;
    toggleMute(muteAlto, gain);
  });

  $('#mute-tenor').click(() => {
    const gain = gainNodes[2].gain;
    toggleMute(muteTenor, gain);
  });

  $('#mute-bass').click(() => {
    const gain = gainNodes[3].gain;
    toggleMute(muteBass, gain);
  });

  $('#unmute-all').click(() => {
    muteButtons.forEach((muteButton, index) => {
      const gain = gainNodes[index].gain;
      const icon = muteButton.find('i');
      const span = muteButton.find('span.icon')
      unmuteAudio(icon, span, gain);
    });
  });

  $('#mute-all').click(() => {
    muteButtons.forEach((muteButton, index) => {
      const gain = gainNodes[index].gain;
      const icon = muteButton.find('i');
      const span = muteButton.find('span.icon')
      muteAudio(icon, span, gain);
    });
  });

  // Attach eventlistener to all items (songs) in the list
  $('.songs').on('click', '.song', function(event) {
    event.preventDefault();
    const songID = $(this).data('id');
    const songTitle = $(this).data('title');
    $('p.song-title').text(songTitle);
    
    getSongLyrics(songID);

    getSongMelody(songID).then((path) => {
      console.log('MELODY:', path);
      const sopranoPath = `../static/assets/audio/${path}/soprano.m4a`;
      const altoPath = `../static/assets/audio/${path}/alto.m4a`;
      const tenorPath = `../static/assets/audio/${path}/tenor.m4a`;
      const bassPath = `../static/assets/audio/${path}/bass.m4a`;

      $('#soprano').find('source').data('src', sopranoPath);
      $('#alto').find('source').data('src', altoPath);
      $('#tenor').find('source').data('src', tenorPath);
      $('#bass').find('source').data('src', bassPath);

      try {
        const wasPlaying = audioContext.state == 'running';
        sources.forEach((source) => {
          source.stop()
          sources = sources.filter(s => s !== source);
        });
        audioContext.close().then(() => {
          initAudioContext().then(() => {
            if (wasPlaying) {
              startPlayback();
              const icon = playPause.find('i');
              icon.removeClass('fa-play');
              icon.addClass('fa-pause');
            }
          })
        })
      } catch (TypeError) {
        initAudioContext();
      }
    })
  });

  $('#song-search').on('keyup', function() {
    var value = $(this).val().toLowerCase();
    $('.songs li').filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $('#select-composer').on('change', function() {
    const composer_id = $(this).find('option:selected').data('id');
    filterSongsByComposer(composer_id);
  })

});
