
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + "," + cityStr;

    $greeting.text("So you want to live at'" + address + "?");

    var streetviewurl = 'http://maps.googleapis.com/maps/api/' +
        'streetview?size=600x300&location=' + address + '';

    $body.append('<img class="bgimg" src="' + streetviewurl + '">');

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?q=';
    url += cityStr;
    url += '&sort=newest&api-key=';
    url += 'c02d90b2abde40a8b903a3705e6a00ae';

    $.getJSON(url, function( data ) {

        $nytHeaderElem.text("New york times article about" + cityStr);

        // this is the where the data is actually stored
        // inside the json there is response and a docs field
        articles = data.response.docs;

        for (var i = 0; i < articles.length; i ++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                    '<a href="'+article.web_url+'">'+
                    article.headline.main+'</a>'+
                    '<p>' + article.snippet + '</p>'+
                    '</li>');
        };
    }).fail(function() {
       $nytHeaderElem.text("New York times could not be loaded");
    });

    //wikipedia ajax
    var wikiurl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
    + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout=setTimeout(function(){
    $wikiElem.text("failed to load wikipedia resources");
    },8000);

    $.ajax({
        url: wikiurl,
        dataType: "jsonp",
        success: function ( response ) {
            var articleList = response[1];

            for(var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    })

    return false;
};

$('#form-container').submit(loadData);
