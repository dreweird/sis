var express = require('express'); // Express App include
var app = express();
var http = require('http').Server(app); // http server
var path = require('path');
var mysql = require('mysql'); // Mysql include
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var async = require('async');
var staticRoot = __dirname + '/../dist'; 


var db_config = {
    host : '172.16.130.8',
    user : 'pmis',
    password : 'pmis',
    database : 'rpis',
    multipleStatements: true
 }
 
 /*var connection = mysql.createConnection({
   host     : '172.16.130.8',
   user     : 'pmis',
   password : 'pmis',
   database : 'rpis',
   multipleStatements: true
 });*/
 

 /*connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});*/

 function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
handleDisconnect();


http.listen(3200,function(){  
    console.log("All right ! I am alive at Port 3200.");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static(staticRoot));

app.post('/auth',function(req,res){
    console.log(req.body);
    var query = "SELECT * FROM ?? WHERE ??=? and ??=?";
    var table = ["user", "username", req.body.username, "password", req.body.password];
    query = mysql.format(query,table);
    console.log(query);
    var data = {};    
    connection.query(query,function(err, rows, fields){
        if(rows.length != 0){
           // data["data"] = rows;
            res.json(rows);

        }else{
           // data["data"] = false;
            res.json(false);
        }
    });
});


app.get('/item',function(req,res){
    var itemsProcessed = 0;
    var warehouses = ['Taguibo', 'Del Monte', 'Trento'];    
    connection.query(`select * from item order by name ASC`,function(err, rows, fields){
        if(rows.length != 0){ 
            async.each(rows, function(row, callback){
                var quantity =function(warehouses, callback){
                 var sql = "SELECT COALESCE(SUM(quantity),0) as qty FROM issue where item_id= ? and location= ?";
                    connection.query(String(sql),[row.id, warehouses],function(k_err,k_rows){
                        if(k_err) console.error(k_err);
                        return callback(null, k_rows[0].qty);
                    }); 
                }

            async.map(warehouses, quantity, function(err, result){
               // console.log(result);
                row.qty=result;
                itemsProcessed++;
                if(itemsProcessed === rows.length) {
                   //console.log(rows);
                    res.json(rows);                           
                }
            });

            })  
        
        }
    });
});

app.get('/logs',function(req,res){
    connection.query(`select * from issue inner join item on issue.item_id=item.id`, function (error, results, fields) {
        if (error) throw error;
        res.json(results); 
    });
});

app.post('/additem',function(req,res){
    delete req.body.qty;
    connection.query(`INSERT INTO item SET ? ON DUPLICATE KEY UPDATE    
    ?`, [req.body, req.body], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/issuedetails',function(req,res){
    connection.query('SELECT * FROM issue WHERE item_id = ? and location = ?', [req.body.id, req.body.loc], function (error, results, fields) {
        if (error) throw error;
        res.json(results); 
    });
});

app.post('/addissue',function(req,res){
    connection.query('INSERT INTO issue SET ?', req.body, function (error, results, fields) {
        if (error) throw error;
        res.json(results); 
    });
});

app.delete('/delItem/:id',function(req,res){
    const id = req.params.id;
    connection.query("DELETE FROM item where id = ?", id, function(error, results, fields){
        if (error) throw error;
        res.json(results);
    });
});

app.delete('/delIssue/:id',function(req,res){
    const id = req.params.id;
    connection.query("DELETE FROM issue where id = ?", id, function(error, results, fields){
        if (error) throw error;
        res.json(results);
    });
});

app.get('/', function (req, res) {
res.sendFile(path.join(staticRoot,'index.html'))
});

app.get('*', function (req, res) {
    res.sendFile(path.join(staticRoot,'index.html'));
   });

