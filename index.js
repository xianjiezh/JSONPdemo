var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  if (path === '/') {
    var string = fs.readFileSync('./index.html', 'utf-8')
    var amount = fs.readFileSync('./db', 'utf-8')
    string = string.replace('&&&amount&&&', amount)
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  } else if(path == '/style.css'){
    response.setHeader('Content-Type','text/css;charset=utf-8')
    response.write('body{color:green;}')
    response.end()
  }else if (path === '/pay') {
    var amount = fs.readFileSync('./db', 'utf-8')
    
    var newAmount = amount - 1
    fs.writeFile('./db',newAmount,function err(error) {
      console.log(error)
    })
    response.setHeader('Content-Type','text/javacript;charset=utf-8')
    response.write(`
      ${query.callbackName}.call(undefined,'success')
    `)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('404了')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})
/*
var newAmount = amount - 1
    fs.writeFileSynk('./db', newAmount)
    
    response.statusCode = 200
    response.write(`
      ${query.callbackName}.call(undefined,'success')
    `)
    
*/
server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)