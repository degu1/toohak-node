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

app.get("/quizes", (req, res, next) => {
    var sql = "select * from quizes"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "quizes":rows
        })
      });
});


app.get("/quizes/:quizName", (req, res, next) => {
    var sql = "select * from quizes where quizName = ?"
    var params = [req.params.quizName]
    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "quizes":row
        })
      });
});

app.get("/quiznames/", (req, res, next) => {
    var sql = "select DISTINCT quizName from quizes"
    var params = [req.params.quizName]
    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "quizes":row
        })
      });
});


app.post("/quizes/", (req, res, next) => {
    var errors=[]
    if (!req.body.quizName){
        errors.push("No name");
    }
    var data = {
        quizName: req.body.quizName,
        quizQuestion: req.body.quizQuestion,
        quizCorrectanswer: req.body.quizCorrectanswer,
        quizAnswer1: req.body.quizAnswer1,
        quizAnswer2: req.body.quizAnswer2,
        quizAnswer3: req.body.quizAnswer3,
        quizAnswer4: req.body.quizAnswer4
    }
    var sql ='INSERT INTO quizes (quizName, quizQuestion, quizCorrectanswer, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4) VALUES (?,?,?,?,?,?,?)'
    var params =[data.quizName, data.quizQuestion, data.quizCorrectanswer, data.quizAnswer1, data.quizAnswer2, data.quizAnswer3, data.quizAnswer4]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "quiz": data
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

