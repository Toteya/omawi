// Handles API requests

const getSongMelody = async (song_id) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: `http://127.0.0.1:5001/api/v1/songs/${song_id}/melodies`,
      contentType: 'application/json',
      success: (melodies) => {
        // TO BE UPDATED: For now just return the first melody object in the array
        try {
          resolve(melodies[0].filepath);
        } catch (TypeError) {
          throw new Error('Melody not found');
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  })
}

const getSongLyrics = async (song_id) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: `http://127.0.0.1:5001/api/v1/songs/${song_id}/verses`,
      contentType: 'application/json',
      success: (verses) => {
        $('div.lyrics').empty();
        if (verses.length > 0) {
          for (const verse of verses) {
            const number = $('<h4></h4>');
            const lyrics = $('<p></p>');
            const linebreak = $('<br>');
            number.text(`${verse.number}.`);
            lyrics.text(verse.lyrics);
            $('div.lyrics').append(number, lyrics, linebreak);
          }
        } else {
          const p1 = $('<p></p>');
          const p2 = $('<p></p>');
          const line1 = $('<em></em>');
          const line2 = $('<em></em>');
          line1.text('Lyrics currently unvailable for this song.')
          line2.text('Please try again later.')
          p1.append(line1);
          p2.append(line2);
          $('div.lyrics').append(p1, p2);
        }
        resolve(verses)
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

const filterSongsByComposer = (composer_id) => {
  let url;
  if (composer_id === undefined) {
    url = `http://127.0.0.1:5001/api/v1/songs`;
  } else {
    url = `http://127.0.0.1:5001/api/v1/composers/${composer_id}/songs`;
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: url,
      contentType: 'application/json',
      success: (songs) => {
        const listNav = $('#nav-songlist');
        const listSide = $('#side-songlist');
        for (const list of [listNav, listSide]) {
          list.empty();
          if (songs.length > 0) {
            for (const song of songs) {
              const listItem = $('<li></li>');
              let anchor;
              if (list.attr('id') === 'side-songlist') {
                anchor = $('<a class="song"></a>');
              } else {
                anchor = $('<a class="song nav-item is-tab is-hidden-tablet"></a>');
              }
              const span = $('<span class="icon is-small"></span>');
              const icon = $('<i class="fa fa-music"></i>');
              span.append(icon);
              anchor.data('id', song.id);
              anchor.data('title', song.title);
              anchor.append(span);
              anchor.text(song.title);
              listItem.append(anchor);
              list.append(listItem);
            }
          } else {
              const p = $('<p></p>');
              const line = $('<em></em>');
              line.text('No matches');
              p.append(line);
              list.append(p);
          }
        }
        resolve(songs)
      },
      error: (error) => {
        reject(error)
      },
    });
  });
}

export {
  getSongMelody,
  getSongLyrics,
  filterSongsByComposer,
};
