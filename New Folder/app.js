var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser('12345-67890-09876-54321'));

app.get('/', function (req, res) {
  // Cookies that have not been signed

  console.log('Cookies: ', req.signedCookies.user)

})

app.listen(8080)