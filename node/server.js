/****************************
 SERVER MAIN FILE
 ****************************/

// need to add in case of self-signed certificate connection
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// For environment variables [will work with .env file]
require("dotenv").config();

// Include Modules
let exp = require("express");
let config = require("./configs/configs");
let express = require("./configs/express");
// let mongoose = require('./configs/mongoose');
let path = require("path");
let fs = require("fs");
let https = require("https");
let cronService = require("./app/services/Cron");
let CommonService = require("./app/services/Common");
let i18n = require("i18n");
var mysql = require("mysql");
i18n.configure({
  locales: ["en", "es", "de"],
  directory: __dirname + "/app/locales",
  defaultLocale: "en"
});
let swaggerUi = require("swagger-ui-express");

// HTTP Authentication
var basicAuth = require("basic-auth");
var auth = function(req, res, next) {
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
  if (
    user.name === config.HTTPAuthUser &&
    user.pass === config.HTTPAuthPassword
  ) {
    next();
  } else {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
};

global.appRoot = path.resolve(__dirname);

config.con = mysql.createConnection(config.sqlConfiguration);

config.con.connect(function(err) {
  if (err) {
    console.log(err, "err");
    throw err;
  }
  config.con.query("USE PasswordGuessing", (err, result, fields) => {
    if (err) {
      config.con.query(
        "CREATE DATABASE PasswordGuessing",
        (err, result, fields) => {
          if (err) {
            console.log(err, "err");
          } else {
            config.con.query("USE PasswordGuessing", (err, result, fields) => {
              if (err) {
                console.log(err, "err");
              } else {
                const sqlQuery = `CREATE TABLE passwordList (password_id INT AUTO_INCREMENT PRIMARY KEY,password VARCHAR(255))`;
                config.con.query(sqlQuery, (err, result, fields) => {
                  if (err) {
                    console.log(err, "err");
                  } else {
                    const insertQuery = `INSERT INTO passwordList (password) VALUES (123),(456),(789)`;
                    config.con.query(insertQuery, (err, result, fields) => {
                      if (err) {
                        console.log(err, "err");
                      } else {
                        console.log('Database selected')
                      }
                    });
                  }
                });
              }
            });
          }
        }
      );
    } else {
        config.con.query("USE PasswordGuessing", (err, result, fields) => {
            if(err){
                console.log(err,'err')
            }else{
                console.log('Database selected')
            }
        })
    //   config.con.query(
    //     "DROP DATABASE PasswordGuessing",
    //     (err, result, fields) => {
    //       console.log(result, "result");
    //     }
    //   );
    }
  });
  console.log("Connected!");
});
// db = mongoose();
const app = express();

app.get("/", function(req, res, next) {
  res.send("hello world");
});

/* Old path for serving public folder */
app.use("/public", exp.static(__dirname + "/public"));

if (process.env.NODE_ENV !== "production") {
  var options = {
    customCss: ".swagger-ui .models { display: none }"
  };
  let mainSwaggerData = JSON.parse(fs.readFileSync("swagger.json"));
  mainSwaggerData.host = config.host + ":" + config.serverPort;
  mainSwaggerData.basePath = config.baseApiUrl;

  const modules = "./app/modules";
  fs.readdirSync(modules).forEach(file => {
    if (fs.existsSync(modules + "/" + file + "/swagger.json")) {
      const stats = fs.statSync(modules + "/" + file + "/swagger.json");
      const fileSizeInBytes = stats.size;
      if (fileSizeInBytes) {
        let swaggerData = fs.readFileSync(
          modules + "/" + file + "/swagger.json"
        );
        swaggerData = swaggerData
          ? JSON.parse(swaggerData)
          : { paths: {}, definitions: {} };
        mainSwaggerData.paths = {
          ...swaggerData.paths,
          ...mainSwaggerData.paths
        };
        mainSwaggerData.definitions = {
          ...swaggerData.definitions,
          ...mainSwaggerData.definitions
        };
      }
    }
  });
  if (config.isHTTPAuthForSwagger) {
    app.get("/docs", auth, (req, res, next) => {
      next();
    });
  }
  let swaggerDocument = mainSwaggerData;
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
}

// (new cronService()).scheduleCronJobs();

// configure https for listening server.

// const httpsoptions = {
//     key: fs.readFileSync('server-key.pem'),
//     cert: fs.readFileSync('server-cert.pem')
// };

// app.get('*', function (req, res) {
//     res.redirect('https://' + req.headers.host + req.url);
// });
// https.createServer(httpsoptions, app).listen(config.serverPort, () => {
//     console.log('process.env.NODE_ENV', process.env.NODE_ENV);
//     console.log(`Server running at https://localhost:${config.serverPort}`);
// });

// Listening Server
app.listen(config.serverPort, async () => {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  // let currencyResult = await (new CommonService()).convertCurrency(10, 'USD', 'PHP');
  // console.log('currencyResult', currencyResult);

  console.log(`Server running at http://localhost:${config.serverPort}`);
});
