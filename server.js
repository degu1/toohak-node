var express = require("express")
var app = express()
var cors = require('cors')
var db = require("./database.js")

app.use(cors())
app.use(express.static('public'))

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var HTTP_PORT = 3000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/quizes", (req, res, next) => {
    var sql = "select * from quizes"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "quizes": rows
        })
    });
});

app.get("/quizes/:quiz_id", (req, res, next) => {
    var sql = `SELECT * FROM quizes WHERE quizes.quiz_id = ?`
    var params = [req.params.quiz_id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "quizes": rows
        })
    });
});

app.get("/quizes/user/:user_id", (req, res, next) => {
    var sql = `SELECT q.quiz_id, q.quiz_name FROM quizes q
        INNER JOIN classes_quizes cq ON q.quiz_id = cq.quiz_id
        INNER JOIN classes c ON c.classes_id = cq.classes_id
        INNER JOIN users_classes uc ON c.classes_id = uc.classes_id
        where uc.user_id = ?`
    var params = [req.params.user_id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "quizes": rows
        })
    });
});

app.get("/questions/:quiz_id", (req, res, next) => {
    var sql = "select * from questions where quiz_id = ?"
    var params = [req.params.quiz_id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "questions": rows
        })
    });
});

app.get("/answers/:quiz_id", (req, res, next) => {
    var sql = `SELECT q.question_id, a.answer
    from questions q 
    INNER JOIN answers a on a.question_id = q.question_id
    where q.quiz_id = ?;`
    var params = [req.params.quiz_id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "answers": rows
        })
    });
});

app.get("/questions", (req, res, next) => {
    var sql = "select * from questions"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "questions": rows
        })
    });
});

app.get("/answers", (req, res, next) => {
    var sql = "select * from answers"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "answers": rows
        })
    });
});

app.get("/quizes/:quizName", (req, res, next) => {
    var sql = "select * from quizes where quizName = ?"
    var params = [req.params.quizName]
    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "quizes": row
        })
    });
});

app.get("/quiznames/", (req, res, next) => {
    var sql = "select DISTINCT quiz_id, quiz_name from quizes"
    // var params = [req.params.quiz_name]
    db.all(sql, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "quizes": row
        })
    });
});


app.post("/quizes/", (req, res, next) => {
    var errors = []
    if (!req.body.quiz_name) {
        errors.push("No name");
    }
    var data = {
        quiz_name: req.body.quiz_name
    }
    var sql = 'INSERT INTO quizes (quiz_name) VALUES (?)'
    var params = [data.quiz_name]
    db.run(sql, params, function (err, result) {
        if (err) {
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
    var errors = []
    if (!req.body.question) {
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
    var sql = 'INSERT INTO questions (question, correct_answer, answer1, answer2, answer3, answer4, quiz_id) VALUES (?,?,?,?,?,?,?)'
    var params = [data.question, data.correct_answer, data.answer1, data.answer2, data.answer3, data.answer4, data.quiz_id]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "quiz": data
        })
    });
})

app.post("/result/", (req, res, next) => {
    var data = {
        result: req.body.result,
        question_id: req.body.question_id,
        user_id: req.body.user_id
    }
    var sql = 'INSERT INTO result (result, question_id, user_id) VALUES (?,?,?)'
    var params = [data.result, data.question_id, data.user_id]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "result": data.result,
            "question_id": data.question_id,
            "user_id": data.user_id
        })
    });
})
