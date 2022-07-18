function picFormatter(value) {
    return "<img src='" + value + "' class='img-rounded img-responsive'>"
}

function getdata(url) {
    //console.log(url);
    //1.获取元数据
    $.get(url)
        .then(jsonstr => JSON.parse(jsonstr))
        .then(jsonobj => jsonobj.list)

        //2.优化json数据
        .then(data => {
            data.map((v, i, a) => {
                //v.vod_pic = "<img src='" + v.vod_pic + "'>"; //显示图片
                v.vod_play_url = v.vod_play_url.split("$$$").join('#').split('#').map(a => { //显示分集
                    var as = a.split('$');
                    a = "<a href='" + (as[1]||as[0]) + "' target='_blank' class='btn btn-info btn-sm' style='border-radius: 20px;'>" + as[0] + "</a>";
                    return a
                }).join('');
            });
            //console.log(data);
            return data;
        })

        //3.追加data到表格
        .then(data => $('#table').bootstrapTable('append', data))
        .fail(err => console.log("err:" + JSON.stringify(err)))
}
let searchentry = [
    'https://sugengzy.cn/api.php/provide/vod/', //速更资源网
    'https://www.yaliyali.cc/api.php/provide/vod/', //呀哩呀哩动漫网
    'https://m3u8.apiyhzy.com/api.php/provide/vod/', //樱花资源网
    'http://api.fqzy.cc/api.php/provide/vod/', //番茄资源站
    'https://www.foxzyw.com//api.php/provide/vod/', //fox资源网
    'http://vipmv.cc/api.php/provide/vod/', //天堂资源网
    'https://api.ukuapi.com/api.php/provide/vod/', //U酷资源网
    'https://www.feisuzy.com/api.php/provide/vod/', //飞速资源网 
];

let searchentry18x = [
    'https://api.xiuseapi.com/api.php/provide/vod/', //秀色资源网
    'https://mgzyz1.com/api.php/provide/vod/',
    'https://www.leyuzyapi.com/inc/apijson_vod.php',
    'https://apittzy.com/api.php/provide/vod/',
    'http://api.kdapi.info/api.php/provide/vod/',
    'https://api.xiuseapi.com/api.php/provide/vod/',
    'https://api.apilyzy.com/api.php/provide/vod/',
    'https://apilj.com/api.php/provide/vod/at/json/',
    'https://51smt4.xyz/api.php/provide/vod/',
    'https://lbapi9.com/api.php/provide/vod/at/json/',
    'https://apihjzy.com/api.php/provide/vod/at/json/',
    'http://fhapi9.com/api.php/provide/vod/at/json/',
    'https://shayuapi.com/api.php/provide/vod/at/json/',
    'https://caiji.caomeiapi.com/inc/apijson_vod.php',
    'https://api.kudian70.com/api.php/provide/vod/',
    'https://cj.apiabzy.com/api.php/provide/vod/',
    'https://apihjzy.com/api.php/provide/vod/',
];

let searchentrytmp = [];

function concurrent_getdata(searchurl) {
    //console.log(searchurl);
    var concurrent_list = [];
    for (var i = 0; i < searchentry.length; i++) {
        concurrent_list.push(getdata(searchentry[i] + searchurl));
    }

    axios.all(concurrent_list)
        .then(axios.spread((...arguments) => {
            //console.log(searchentry.length + "个执行完毕！", ...arguments);
        }));
}

$(document).ready(function () {
    var searchurl = location.search || '?ac=detail&wd='; //?ac=detail&wd=xxx
    //concurrent_getdata(searchurl);

    $('#search_btn').click(function () {
        $('#table').bootstrapTable('removeAll'); //清空表格数据

        var searchurl = '?ac=detail&wd=' + $('#search_wd').val();
        concurrent_getdata(searchurl);
    })

    var pgnum = 1;
    $('#search_next_btn').click(function () {
        pgnum += 1;
        var searchurl = '?ac=detail&wd=' + $('#search_wd').val() + '&pg=' + pgnum;
        concurrent_getdata(searchurl);
    })

    var switch_btn_flag = 0;
    $('#switch_btn').click(function () {
        switch_btn_flag++;
        if(switch_btn_flag%5 == 0){
            searchentrytmp = searchentry;
            searchentry = searchentry18x;
            $('#search_wd').attr('placeholder','你懂的 ^_^ ') ;
        }else{
            searchentry = searchentrytmp;
            $('#search_wd').attr('placeholder','一键搜索全网影视资源站! ') ;
        }
    })

})
