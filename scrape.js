var request = require('request');
var cheerio = require('cheerio');

var options = {
  url: 'http://www.shine.com/job-search/simple/bangalore/',
  headers: {
    //'Cookie': '_ncenv[lang]=en; _ncenv[env]=mobile'
  },
  formData: {
    /*
    "id":"",
    "xz":"33_0_0",
    "qs":"r",
    "qctcFil":"1",
    "qp":"Software+Engineer",
    "ql":"Bangalore",
    "qe":"",
    "qm":""
    */
  }
};

function handleHomepage(error, response, html) {
  //console.log(html);
  //console.log(response.headers);
  //return;

  if (error || response.statusCode != 200) {
    console.log('Error');

    return;
  }

    var $ = cheerio.load(html);

    //console.log($('section #srchTpls').html());
    // return;

    $('div.search_listingleft').each(function(i, element){
      console.log($(this).children().lenght());
    });

/*
      var a = $(this).prev();
      var rank = a.parent().parent().text();
      var title = a.text();
      var url = a.attr('href');
      var subtext = a.parent().parent().next().children('.subtext').children();
      var points = $(subtext).eq(0).text();
      var username = $(subtext).eq(1).text();
      var comments = $(subtext).eq(2).text();
      // Our parsed meta data object
      var metadata = {
        rank: parseInt(rank),
        title: title,
        url: url,
        points: parseInt(points),
        username: username,
        comments: parseInt(comments)
      };
      console.log(metadata);
      */
}

request.post(options, handleHomepage);
