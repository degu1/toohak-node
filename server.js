const express = require("express")
const app = express()
const cors = require('cors')
const db = require("./database.js")


app.use(cors())
app.use(express.static('public'))

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const HTTP_PORT = 3000

async function dbAllPromise(query, params) {
    return new Promise(function (resolve, reject) {
        db.all(query, params, function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

async function dbRunPromise(query, params) {
    return new Promise(function (resolve, reject) {
        db.run(query, params, function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function errorHandler(err, res) {
    console.error(err.message)
    res.status(400).json({"error": err.message})
}

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/quizes", (req, res) => {
    const sql = "select * from quizes"
    const params = []
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quizes": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/quizes/:quiz_id", (req, res) => {
    const sql = `SELECT * FROM quizes WHERE quizes.quiz_id = ?`
    const params = [req.params.quiz_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quizes": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }

});

app.get("/quizes/users/:user_id", (req, res) => {
    const sql = `SELECT DISTINCT q.quiz_id, q.quiz_name FROM quizes q
        INNER JOIN classes_quizes cq ON q.quiz_id = cq.quiz_id
        INNER JOIN classes c ON c.classes_id = cq.classes_id
        INNER JOIN users_classes uc ON c.classes_id = uc.classes_id
        where uc.user_id = ?`
    const params = [req.params.user_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quizes": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/questions/:quiz_id", (req, res) => {
    const sql = "select * from questions where quiz_id = ?"
    const params = [req.params.quiz_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "questions": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/answers/:quiz_id", (req, res) => {
    const sql = `SELECT q.question_id, a.answer_id, a.answer
    from questions q 
    INNER JOIN answers a on a.question_id = q.question_id
    where q.quiz_id = ?;`
    const params = [req.params.quiz_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "answers": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }

});

app.get("/questions", (req, res) => {
    const sql = "select * from questions"
    const params = []
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "questions": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/answers", (req, res) => {
    const sql = "select * from answers"
    const params = []
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "answers": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/quizes/:quizName", (req, res) => {
    const sql = "select * from quizes where quizName = ?"
    const params = [req.params.quizName]
    try {
        db.all(sql, params, (err, row) => {
            res.json({
                "message": "success",
                "quizes": row
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/quiznames/", (req, res) => {
    const sql = "select DISTINCT quiz_id, quiz_name from quizes"
    try {
        db.all(sql, (err, row) => {
            res.json({
                "message": "success",
                "quizes": row
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.post("/quiz_name/:quizName", async (req, res) => {
    const sql = 'INSERT INTO quizes (quiz_name, quiz_passing) VALUES (?,0)'
    const params = [req.params.quizName]
    const sql2 = `SELECT quiz_id FROM quizes WHERE quiz_name = ?`
    try {
        await dbRunPromise(sql, params)
        db.all(sql2, params, function (err, result) {
            res.json({
                "message": "success",
                "quiz_id": result[0].quiz_id
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
})

app.get("/results/", (req, res) => {
    const sql = "select * from result"
    try {
        db.all(sql, (err, row) => {
            res.json({
                "message": "success",
                "result": row
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.post("/result/", (req, res) => {
    const data = {
        result: req.body.result,
        question_id: req.body.question_id,
        user_id: req.body.user_id
    }
    const sql = 'REPLACE INTO result (result, question_id, user_id) VALUES (?,?,?)'
    const params = [data.result, data.question_id, data.user_id]
    try {
        db.run(sql, params, function () {
            res.json({
                "message": "success",
                "result": data.result,
                "question_id": data.question_id,
                "user_id": data.user_id
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
})

app.post("/results/", (req, res) => {
    const results = req.body.results
    const user_id = req.body.user_id
    const sql = 'REPLACE INTO result (result, question_id, user_id) VALUES (?,?,?)'
    try {
        for (let i = 0; i < results.length; i++) {
            let result = results[i].result
            let question_id = results[i].question_id
            db.run(sql, [result, question_id, user_id])
        }
        res.json({
            "message": "success"
        })
    } catch (err) {
        errorHandler(err, res)
    }
})

app.post("/quiz_question/", async (req, res) => {
    const data = req.body
    let questionId

    const sql1 = 'INSERT INTO questions (question, correct_answer, quiz_id) VALUES (?,?,?)'
    let params1 = [data.question, data.correct_answer, data.quiz_id]

    const sql2 = 'SELECT question_id FROM questions q WHERE q.question = ?'
    const params2 = [data.question]

    const sql3 = 'INSERT INTO answers (answer, question_id) VALUES (?,?);'

    try {
        await dbAllPromise(sql1, params1)
        let result2 = await dbAllPromise(sql2, params2)
        questionId = result2[0].question_id
        for (let i = 0; i < data.answers.length; i++) {
            console.log("q_id " + questionId + "  " + data.answers[i].answer)
            let params3 = [data.answers[i].answer, questionId]
            db.run(sql3, params3, function (err, result) {
            })
        }
        res.json({
            "message": "success"
        })
    } catch (err) {
        errorHandler(err, res)
    }
})

app.delete("/questions/:questionId", async (req, res) => {
    const sql1 = 'DELETE FROM answers WHERE question_id = ?;'
    const sql2 = 'DELETE FROM questions WHERE question_id = ?;'
    const params = [req.params.questionId]
    try {
        await dbAllPromise(sql1, params)
        db.all(sql2, params, () => {
        });
        res.json({
            "message": "success"
        })
    } catch (err) {
        errorHandler(err, res)
    }
});

app.delete("/quizes/:quizId", (req, res) => {
    const sql = `DELETE FROM answers
                    WHERE question_id IN(
                    SELECT question_id FROM questions q
                    INNER JOIN quizes
                    ON q.quiz_id = quizes.quiz_id
                    WHERE quizes.quiz_id = ?);`
    const sql2 = 'DELETE FROM questions WHERE quiz_id = ?;'
    const sql3 = 'DELETE FROM quizes WHERE quiz_id = ?;'
    const params = [req.params.quizId]
    try {
        db.all(sql, params)
        db.all(sql2, params)
        db.all(sql3, params)
        res.json({"message": "success"})
    } catch (err) {
        errorHandler(err, res)
    }
});

app.put("/passing/:quiz_id/:passingNumber", (req, res) => {
    const sql = 'UPDATE quizes SET quiz_passing = ? WHERE quiz_id = ?;'
    const params = [req.params.passingNumber, req.params.quiz_id]
    try {
        db.run(sql, params, () => {
            res.json({
                "message": "success"
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/passing/:quiz_id", (req, res) => {
    const sql = 'SELECT quiz_passing FROM quizes WHERE quiz_id = ?;'
    const params = [req.params.quiz_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "answers": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.post("/login/", (req, res) => {
    const sql = 'SELECT * FROM users WHERE user_username = ? AND user_password = ?;'
    const params = [req.body.username, req.body.password]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "answers": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.post("/sign-up/", (req, res) => {
    const data = req.body
    const sql = 'INSERT INTO users (user_username, user_password, user_role) VALUES (?,?,?);'
    const params = [data.username, data.password, data.role]
    try {
        db.all(sql, params, () => {
            res.json({
                "message": "success"
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/classes/", (req, res) => {
    const sql = "select * from classes"
    try {
        db.all(sql, (err, rows) => {
            res.json({
                "message": "success",
                "classes": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});


app.post("/classes/:className", (req, res) => {
    const sql = 'INSERT INTO classes (classes_name) VALUES (?);'
    const params = [req.params.className]
    try {
        db.all(sql, params, () => {
            res.json({
                "message": "success"
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.get("/students/:classId", (req, res) => {
    const sql = `SELECT * FROM users u
                    INNER JOIN users_classes uc ON u.user_id = uc.user_id
                    where uc.classes_id = ?;`
    const params = req.params.classId
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "students": rows
            })
        });
    } catch (err) {
        errorHandler(err, res)
    }
});

app.patch("/classes/add_students/", async (req, res) => {
    const sql1 = 'DELETE FROM users_classes where classes_id = ?;'
    const sql2 = 'INSERT INTO users_classes (user_id, classes_id) VALUES (?,?);'
    const data = req.body
    try {
        await dbRunPromise(sql1, [data.classes_id])
        for (let i = 0; i < data.users.length; i++) {
            db.all(sql2, [data.users[i].user_id, data.classes_id])
        }
        res.json({
            "message": "success"
        })
    } catch (err) {
        errorHandler(err, res)
    }
});

app.delete("/classes/:classesId", async (req, res) => {
    const sql1 = "DELETE FROM users_classes where classes_id = ?;"
    const sql2 = "DELETE FROM classes_quizes where classes_id = ?;"
    const sql3 = "DELETE FROM classes where classes_id = ?;"
    const classesId = req.params.classesId
    try {
        await dbAllPromise(sql1, [classesId])
        await dbAllPromise(sql2,[classesId])
        await dbAllPromise(sql3, [classesId])
        res.json({
            "message": "success"
        })
    } catch (err) {
        errorHandler(err, res)
    }
});

app.delete("/classes-user/:classesId/:userId",(req, res) => {
    const sql1 = "DELETE FROM users_classes where classes_id = ? AND user_id = ?;"
    const classesId = req.params.classesId
    const userId = req.params.userId
    try {
        db.run(sql1, [classesId, userId])
        res.json({
            "message": "success"
        })
    } catch (err) {
        errorHandler(err, res)
    }
});


app.get("/user_statistics/users/:userId", (req, res) => {
    const sql = `SELECT quiz.quiz_name, SUM(result) AS result,COUNT(*) AS 'n_questions',
                     CASE WHEN SUM(result) < (COUNT(q.question_id))*quiz.quiz_passing/100 THEN 0 ELSE 1 END passed
                     FROM result r
                     INNER JOIN questions q on q.question_id = r.question_id
                     INNER JOIN quizes quiz ON quiz.quiz_id = q.quiz_id
                     WHERE r.user_id = ?
                     GROUP BY quiz.quiz_id;`
    const params = req.params.userId
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quiz_result": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
});

app.get("/user_statistics/", (req, res) => {
    const sql = `SELECT q.question, q.correct_answer, r.result FROM result r
                    INNER JOIN questions q ON r.question_id = q.question_id
                    WHERE q.quiz_id = ? AND r.user_id = ?;`
    const params = [req.body.quiz_id, req.body.user_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quiz_result": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
});

app.get("/class_statistics/:classId", async (req, res) => {
    const sql1 = `SELECT q.quiz_id, quiz_name FROM quizes q
                    INNER JOIN classes_quizes cq ON q.quiz_id = cq.quiz_id
                    WHERE cq.classes_id=?;`
    const sql2 = `SELECT SUM(result), r.user_id, u.user_username, CASE
                    WHEN SUM(result) < COUNT(q.quiz_id)*quiz.quiz_passing/100 THEN 0 ELSE 1 END pass
                    FROM result r
                    INNER JOIN questions q on q.question_id = r.question_id
                    INNER JOIN users u on u.user_id = r.user_id
                    INNER JOIN users_classes uc on u.user_id = uc.user_id
                    INNER JOIN quizes quiz ON quiz.quiz_id = q.quiz_id
                    WHERE quiz.quiz_id = ? AND uc.classes_id = ?
                    GROUP BY r.user_id;`
    const params = [req.params.classId]
    try {
        await dbAllPromise(sql1, params)
            .then(async function (rows) {
                for (let i = 0; i < rows.length; i++) {
                    await dbAllPromise(sql2, [rows[i].quiz_id, req.params.classId])
                        .then((rows2) => {
                            rows[i].results = rows2
                        })
                }
                res.json({
                    "message": "success",
                    "quiz_result": rows
                })
            })

    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
});