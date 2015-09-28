exports.index = function (req, res){
        res.render("index.html");
}
 
exports.login = function (req, res){
        var login = req.body.login ;
        var password = req.body.password ;
        var sql = "select * from user WHERE login='"+ login +"' AND password='"+ password +"'";
        db.query(sql , function (err , row){
            if (row.length == 1){
                var user = row[0];
                user.ip = CFG.hostAdress;
                console.log(user.login);
                res.render("game.html" , {
                     user: user,
                     server: {
                        ip: CFG.hostAdress,
                        port: CFG.httpPort
                     }
                });
            }
            else {
                    res.render("index.html",{});
            }
        });
}
 
exports.register = function (req, res){
        var login = req.body.login;
        var password = req.body.password;
        var mail = req.body.mail;
        var sql , option;
        sql = "insert into user (login,password,mail) values ('"+ login +"','"+ password +"','"+ mail +"')";
        db.query(sql, function (err, row){
            if (err)console.log(err);
        });
        res.end("Success");
}

