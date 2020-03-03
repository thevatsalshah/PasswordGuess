var exp = require('express');
var app = exp();
app.use(exp.static(__dirname + '/dist/angular/'));
app.listen(4003);
console.log('Server running at http://localhost:4003/');
