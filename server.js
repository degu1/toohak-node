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

app.get("/quizes/users/:user_id", (req, res, next) => {
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
    var sql = `SELECT q.question_id, a.answer_id, a.answer
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


app.post("/quiz_name/:quizName", (req, res, next) => {
    var sql = 'INSERT INTO quizes (quiz_name, quiz_passing) VALUES (?,0)'
    var params = [req.params.quizName]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }

    });

    db.all("SELECT quiz_id FROM quizes WHERE quiz_name = ?", params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }
        console.log(result)
        res.json({
            "message": "success",
            "quiz_id": result[0].quiz_id
        })
    });
})

app.get("/results/", (req, res, next) => {
    var sql = "select * from result"
    // var params = [req.params.quiz_name]
    db.all(sql, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "result": row
        })
    });
});

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

app.post("/quiz_question/", (req, res, next) => {
    const data = req.body
    var questionId

    const sql1 = 'INSERT INTO questions (question, correct_answer, quiz_id) VALUES (?,?,?)'
    var params1 = [data.question, data.correct_answer, data.quiz_id]
    db.run(sql1, params1, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }
        async: false
    })

    const sql2 = `SELECT question_id FROM questions q WHERE q.question = ?`
    params2 = [data.question]

    db.all(sql2, params2, function (err, result) {
        if (err) {
            console.log("In err")
            res.status(400).json({"error": err.message})
            return;
        }
        questionId = result[0].question_id
        console.log("in sql2 " + questionId)
        sql3(questionId, data)
        async: false
    })

    res.json({
        "message": "success"
    })
})

function sql3(questionId, data){
    if (questionId !== undefined) {
        const sql3 = 'INSERT INTO answers (answer, question_id) VALUES (?,?);'

        for (let i = 0; i < data.answers.length; i++) {
            console.log("q_id " + questionId + "  " + data.answers[i].answer)
            var params3 = [data.answers[i].answer, questionId]
            db.run(sql3, params3, function (err, result) {
                if (err) {
                    res.status(400).json({"error": err.message})
                    return;
                }
                async: false
            })
        }
        return;
    }
    setTimeout(sql3,100)
}

app.delete("/questions/:questionId", (req, res, next) => {
    const sql = 'DELETE FROM answers WHERE question_id = ?;'
    var params = [req.params.questionId]
    db.all(sql,params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }

    });
    const sql2 = 'DELETE FROM questions WHERE question_id = ?;'
    db.all(sql2,params, (err) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }

    });
    res.json({
        "message": "success"
    })
});

app.delete("/quizes/:quizId", (req, res, next) => {
    const sql = `DELETE FROM answers
                    WHERE question_id IN(
                    SELECT question_id FROM questions q
                    INNER JOIN quizes
                    ON q.quiz_id = quizes.quiz_id
                    WHERE quizes.quiz_id = ?);`
    var params = [req.params.quizId]
    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
    });
    const sql2 = 'DELETE FROM questions WHERE quiz_id = ?;'
    db.all(sql2,params, (err) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
    });
    const sql3 = 'DELETE FROM quizes WHERE quiz_id = ?;'
    db.all(sql3,params, (err) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
    });
    res.json({
        "message": "success"
    })
});

app.put("/passing/:quiz_id/:passingNumber", (req, res, next) => {
    var sql = 'UPDATE quizes SET quiz_passing = ? WHERE quiz_id = ?;'
    var params = [req.params.passingNumber, req.params.quiz_id ]
    db.run(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success"
        })
    });
});

app.get("/passing/:quiz_id", (req, res, next) => {
    var sql = 'SELECT quiz_passing FROM quizes WHERE quiz_id = ?;'
    var params = [req.params.quiz_id ]
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

app.post("/login/", (req, res, next) => {
    var sql = 'SELECT user_id, user_ROLE FROM users WHERE user_username = ? AND user_password = ?;'
    var params = [req.body.username, req.body.password]
    console.log(req.body.username + " "+ req.body.password)
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