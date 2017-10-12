let $lyricWrapper = $('.lyric-wrapper');
let $showArea = $('.showArea');
let id = window.location.search.match(/\bid=([^&]*)/)[1];
let query = new AV.Query('Song');
let $bgImg = $('.bgImg');
let audio = document.createElement('audio');
query.get(id).then(function (song) {
    let {url, cover, name, singer, lyric} = song.attributes;
    let array = initPage(lyric, cover, name, singer);
    initPlayer(url, cover, name, singer);
    setInterval(function () {
        let $lines = $('.lyric-wrapper p');
        let $whichLine ;
        let time = audio.currentTime;
        for (let i = 0; i < array.length; i++) {
            let currentLineTime =$lines.eq(i).attr('data-time');
            let nextLineTime = $lines.eq(i+1).attr('data-time');
            if (i === array.length - 1) {
                break;
            }
            if (currentLineTime<time && nextLineTime > time) {
                $whichLine = $lines.eq(i);
                break;
            }
        }
        if($whichLine){

            let top  = $whichLine.offset().top;

            let lineTop = $('.lyric-wrapper').offset().top;
            let deltaLength  = top - lineTop - $('.showArea').height()/3;

            $('.lyric-wrapper').css('transform',`translateY(-${deltaLength}px)`);
            $whichLine.addClass('active').siblings().removeClass('active');
        }
    }, 500);

});


function initPlayer(url) {

    audio.src = url;

    //播放暂停
    $('.icon-pause').on('click', function () {
        $('.circle').addClass('pause').removeClass('playing');
        audio.pause();
    });

    $('.icon-play').on('click', function () {
        $('.circle').addClass('playing').removeClass('pause');
        audio.play();
    });

}


function initPage(lyric, cover, name, singer) {
    $('.circle>img').attr('src', cover);
    $(`<h1>${name} - ${singer}</h1>`).insertBefore($showArea);
    $bgImg.css(
        {'background': 'url('+cover+')'+'center'+' '+'no-repeat',
        'background-size':'cover'});
    let Lyric = parseLyric(lyric);

    Lyric.map(function (obj) {
        let $p = $('<p/>');
        $p.attr('data-time', obj.time).text(obj.lyric);
        $p.appendTo($lyricWrapper);
    });

    return Lyric;


}


function parseLyric(lyric) {
    //将歌词格式化
    let array = [];
    let parts = lyric.split('\n');

    parts.forEach(function (string, index) {
        let subparts = string.split(']');
        subparts[0] = subparts[0].substring(1);
        if (subparts[1] !== '') {
            array.push({
                time: subparts[0],
                lyric: subparts[1]
            })
        }
    });
//将time转换成秒
    let regex = /(\d+):([\d.]+)/;
    array.forEach(function (obj, index) {
        // console.log(obj);
        if (obj.time !== '') {
            let matches = obj.time.match(regex);
            let minute = +matches[1];
            let seconds = +matches[2];
            obj.time = minute * 60 + seconds;
        }
    });

    return array;
}







// //获取id
// function getParameterByName(name, url) {
//     if (!url) url = window.location.href;
//     name = name.replace(/[\[\]]/g, "\\$&");
//     var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//         results = regex.exec(url);
//     if (!results) return null;
//     if (!results[2]) return '';
//     return decodeURIComponent(results[2].replace(/\+/g, " "));
// }