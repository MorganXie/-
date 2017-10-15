$('.tabs').on('click', 'li', function (e) {
    let $li = $(e.currentTarget);
    let index = $li.index();
    $li.addClass('active').siblings().removeClass('active');
    $('.tab-content').children().eq(index)
        .addClass('active').siblings().removeClass('active');
});

//render playList
let $coverList = $('ol#coverList');

let queryPlayList = new AV.Query('PlayList');
queryPlayList.find().then(function (results) {
    $('#cover-loading').remove();

    for (let i = 0; i < results.length; i++) {
        let eachCover = (results[i].attributes);

        let li = `
            <li>
            <a href="./playList.html?id=${results[i].id}">
            <div class="cover">
              <div class="amount">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-Earphone"></use>
                </svg>
                <p>${eachCover.playAmount}</p>
              </div>
              <img src="${eachCover.imgUrl}" alt="封面"/>
            </div>
            <p>${eachCover.text}</p>
            </a>
          </li>
            `;

        $coverList.append(li);
    }
}, function (error) {
});


// render songs
let $olSongs = $('ol#songs');
let $hotSongs = $('ol#hotSongList');
let queryEachsong = new AV.Query('Song');
queryEachsong.find().then(function (results) {
    $('#songs-loading').remove();
    $('#hotSongs-loading').remove();
    for (let i = 0; i < results.length; i++) {
        let eachSong = (results[i].attributes);
        let li = `
              <li>
            <a href="./song.html?id=${results[i].id}"<h3>${eachSong.name}
            </h3>
            </a>
            <p>
              <svg class="icon icon-sq" aria-hidden="true">
                <use xlink:href="#icon-sq"></use>
              </svg>
              ${eachSong.singer} - <span>${eachSong.Album}</span>
            </p>
            <a href="./song.html?id=${results[i].id}" class="playButton">
              <svg class="icon icon-play" aria-hidden="true">
                <use xlink:href="#icon-play"></use>
              </svg>
            </a>
          </li>
              `;
        $olSongs.append(li);
        $hotSongs.append(li);
    }
}, function (error) {
    alert('获取歌曲失败')
});


//search
function resetPage() {
    $('#searchResult').empty();
    $('.holder').html('搜索歌曲、歌手、专辑');
    $('.hotSongList').css('display', 'flex');
    $('input#search').val('');
}
let timer = null;
$('input#search').on('input', function (e) {
    $('#searchResult').empty();
    $('.holder').html('');
    if (timer) {
        window.clearTimeout(timer);
    }
    timer = setTimeout(function () {
        let $input = $(e.currentTarget);
        let value = $input.val().trim();

        if (value === '') {
            resetPage();
            return
        }
        let querySongs = new AV.Query('Song');
        querySongs.contains('name', value);
        let querySinger = new AV.Query('Song');
        querySinger.contains('singer', value);
        let queryAlbum = new AV.Query('Song');
        queryAlbum.contains('Album', value);

        let queryAll = AV.Query.or(querySongs, querySinger);

        queryAll.find().then(function (results) {
            if (results.length === 0) {
                $('#searchResult').html('<li> <svg class="icon " aria-hidden="true"><use xlink:href="#icon-sousuo"></use></svg><a>没有找到结果</a></li> ');
            }
            else {
                for (let i = 0; i < results.length; i++) {
                    let songs = results[i].attributes;
                    let li =
                        `
                         <li data-id = "${results[i].id}">
                            <svg class="icon " aria-hidden="true">
                          <use xlink:href="#icon-sousuo"></use>
                         </svg>
                            <a href="./song.html?id=${results[i].id}">${songs.name} - ${songs.singer}</a>
                          </li>
                        `;
                    $('.hotSongList').css('display', 'none');
                    $('#searchResult').append(li);

                }
            }
        });
        timer = null;
    }, 500);

    window.onbeforeunload = resetPage;

});



