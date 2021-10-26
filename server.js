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

app.get("/questions/:quiz_id", (req, res, next) => {
    var sql = "select * from questions where quiz_id = ?"
    var params = [req.params.quiz_id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "questions":rows
        })
    });
});

app.get("/questions", (req, res, next) => {
    var sql = "select * from questions"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "questions":rows
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
    var sql = "select DISTINCT quiz_id, quiz_name from quizes"
    // var params = [req.params.quiz_name]
    db.all(sql, (err, row) => {
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
    if (!req.body.quiz_name){
        errors.push("No name");
    }
    var data = {
        quiz_name: req.body.quiz_name
    }
    var sql ='INSERT INTO quizes (quiz_name) VALUES (?)'
    var params =[data.quiz_name]
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

app.post("/questions/", (req, res, next) => {
    var errors=[]
    if (!req.body.question){
        errors.push("No question");
    }
    var data = {
        question: req.body.question,
        correct_answer: req.body.correct_answer,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3,
        answer4: req.body.answer4,
        quiz_id: req.body.quiz_id
    }
    var sql ='INSERT INTO questions (question, correct_answer, answer1, answer2, answer3, answer4, quiz_id) VALUES (?,?,?,?,?,?,?)'
    var params =[data.question, data.correct_answer, data.answer1, data.answer2, data.answer3, data.answer4, data.quiz_id]
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

