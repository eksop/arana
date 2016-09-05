//This is an example of how to scrape the web using PhantomJS and jQuery:
//source: http://snippets.aktagon.com/snippets/534-How-to-scrape-web-pages-with-PhantomJS-and-jQuery
//http://phantomjs.org/

var page = new WebPage();

var debug = false;
var url = 'http://www.shine.com/job-search/simple/pune/';
var selector = 'div.search_listingleft a span.snp_yoe_loc em.snp_loc';
var stepIndex = 0;

 /**
  * From PhantomJS documentation:
  * This callback is invoked when there is a JavaScript console. The callback may accept up to three arguments:
  * the string for the message, the line number, and the source identifier.
  */
 page.onConsoleMessage = function (msg, line, source) {
     console.log('console> ' + msg);
 };

 /**
  * From PhantomJS documentation:
  * This callback is invoked when there is a JavaScript alert. The only argument passed to the callback is the string for the message.
  */
 page.onAlert = function (msg) {
     console.log('alert!!> ' + msg);
 };

 // Callback is executed each time a page is loaded...
 page.open(url, function (status) {
   if (status === 'success') {
     // State is initially empty. State is persisted between page loads and can be used for identifying which page we're on.
     console.log('============================================');
     console.log('Step "' + stepIndex + '"');
     console.log('============================================');

     // Inject jQuery for scraping (you need to save jquery-1.6.1.min.js in the same folder as this file)
     if (!page.injectJs('jquery.min.js')) {
       console.log("jquery not loaded, exiting");

       return;
     }


    var title = page.evaluate(function() {
       return document.title;
    });

    page.evaluate(function() {
      $("div.search_listingleft").each(function(div, div2) {
        console.log(div2);

     //console.log("$(\".explanation\").text() -> " + $(".explanation").text());
    });

    phantom.exit(0);
   }
 });
