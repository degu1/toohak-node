var express = require("express")
var app = express()
var cors = require('cors')
var db = require("./database.js")

app.use(cors())
app.use(express.static('public'))

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var HTTP_PORT = 3000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/bok", (req, res, next) => {
    var sql = "select * from bok"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "bok":rows
        })
      });
});


app.get("/api/bok/:id", (req, res, next) => {
    var sql = "select * from bok where bokId = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "bok":row
        })
      });
});


app.post("/api/bok/", (req, res, next) => {
    var errors=[]
    if (!req.body.bokIsbn){
        errors.push("Inget ISBN");
    }
    var data = {
        bokTitel: req.body.bokTitel,
        bokForfattare: req.body.bokForfattare,
        bokIsbn: req.body.bokIsbn,
        bokPris: req.body.bokPris
    }
    var sql ='INSERT INTO bok (bokTitel, bokForfattare, bokIsbn, bokPris) VALUES (?,?,?,?)'
    var params =[data.bokTitel, data.bokForfattare, data.bokIsbn, data.bokPris]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "bok": data,
            "id" : this.lastID
        })
    });
})

app.put("/api/bok/:id", (req, res, next) => {
    var data = {
        bokTitel: req.body.bokTitel,
        bokForfattare: req.body.bokForfattare,
        bokIsbn: req.body.bokIsbn,
        bokPris: req.body.bokPris
    }
    var sql ='UPDATE bok SET bokTitel = ?, bokForfattare = ?, bokIsbn = ?, bokPris = ? WHERE bokId = ?'
    var params =[data.bokTitel, data.bokForfattare, data.bokIsbn, data.bokPris, req.params.id]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "bok": data,
            "id" : this.lastID
        })
    });
})

app.delete("/api/bok/:id", (req, res, next) => {
    db.run(
        'DELETE FROM bok WHERE bokId = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

