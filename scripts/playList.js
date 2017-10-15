let HotSongQuery = new AV.Query('Song');
initPage();
let id = window.location.search.match(/\bid=([^&]*)/)[1];
let topBarQuery = new AV.Query('PlayList');
topBarQuery.get(id).then(function (results) {
    let inner = ` 
 <div class="innerWrapper">
      <div class="before"></div>
      <div class="cover">
        <img src="${results.attributes.imgUrl}" alt="cover">
        <div class="coverText">
          <span>歌单</span>
          <svg class="icon " aria-hidden="true">
            <use xlink:href="#icon-Earphone"></use>
          </svg>
          <p>${results.attributes.playAmount}</p>
        </div>
      </div>
      <div class="title">
        <h2>${results.attributes.text}</h2>
        <div class="Avatar">
          <img src="https://ws1.sinaimg.cn/large/d6c04639gy1fkhrqpn154j20sg0sg0u2.jpg" alt="">
          <p>CharitySylvia</p>
        </div>
      </div>
    </div>
    `;
    $('.topBar').append(inner);

    $('.before').css( {'background': 'url('+results.attributes.imgUrl+')'+' '+'no-repeat',
        'background-size':'cover'});

});

function initPage() {
    HotSongQuery.find().then(function (results) {
        for (let i = 0; i < results.length; i++) {
            let li = `
                <li class="songInfo">
                      <a href="./song.html?id=${results[i].id}"><div class="range">${i + 1}</div>
                      <div class="eachSong">
                        <p class="songName">${results[i].attributes.name}</p>
                        <p class="singer-Album">${results[i].attributes.singer} - ${results[i].attributes.Album}</p>
                      </div>
                      <svg class="icon " aria-hidden="true">
                        <use xlink:href="#icon-play"></use>
                      </svg>
                      </a>
                </li>
                `;
            $('.PlayList').append(li);
        }
    })
}


$('.description-Text >svg.Up').on('click', function () {
    $('.description-Text').addClass('hidden');
    $('.description-Text>svg.Down').addClass('active').siblings().removeClass('active');
});

$('.description-Text >svg.Down').on('click', function () {
    $('.description-Text').removeClass('hidden');
    $('.description-Text>svg.Up').addClass('active').siblings().removeClass('active');
});
