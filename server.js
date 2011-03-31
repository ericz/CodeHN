var http = require("http");

var store = "";

setInterval(recache, 30000);
recache();

function recache() {
 
  var options = {
    host: 'api.ihackernews.com',
    port: 80,
    path: '/page'
  };

  http.get(options, function(res) {
    var body = "";
    res.on('data', function(chunk){body += chunk;});
    res.on('end', function(){
      try {
        store = JSON.parse(body)['items'];
        for(var i in store) {
          store[i].camel = store[i].title.toCamelCase().replace(/[\.\'–—\+’,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
          store[i].camel = store[i].camel[0].toLowerCase() + store[i].camel.slice(1);
          //store[i].description = store[i].description.replace("Comments", "comments");
        }
      } catch (e) {}
    });
  });
}

var express = require("express");
var app = express.createServer();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('view options', {
  layout: false
});

app.get('/', function(req, res){
  res.render('index', {store: store});
});

app.listen(8081);

String.prototype.toCamelCase = function() {
  return this.toString()
    .replace(/([A-Z]+)/g, function(m,l){
      return l.substr(0,1).toUpperCase() + l.toLowerCase().substr(1,l.length);
    })
    .replace(/[\-_\s](.)/g, function(m, l){
      return l.toUpperCase();
    });
};