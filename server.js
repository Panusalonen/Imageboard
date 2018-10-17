const express = require("express");
const app = express();
const s3 = require("./s3");

const ca = require("chalk-animation");
const bp = require("body-parser");
const db = require("./db.js");
const config = require("./config");

app.use(express.static("./public"));

app.use(
    bp.urlencoded({
        extended: false
    })
);

app.use(bp.json())

/////// MULTER MIDDLEWARE ///////

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/images/:id", (req, res) => {
    // console.log("checking params: ", req.params.id);
    var imageId = req.params.id;
    db.getImageInfo(imageId)
        .then(images => {
            // console.log("imgs ", imgs.rows);
            var imgInfo = images.rows;
            db.selectComments(imageId)
            .then(results => {
                res.json({
                    imgInfo,
                    comments: results.rows
                });
            })
        })
        .catch(err => {
            console.log("error: ", err);
    });
});

app.get("/images", (req, res) => {
    db.getTables()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error: ", err);
        });
});

app.get("/getMoreImages/:idOfLastImg", (req, res) => {
    // console.log("idoflastimg ", req.params.idOfLastImg);
    db.getMoreImages(req.params.idOfLastImg)
        .then(results => {
            // console.log("results.rows: ", results.rows);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error: ", err);
    });
})

app.post("/images/:id", (req, res) => {
    // console.log("comment: ", req.body.comment);
    db.insertComments(req.params.id, req.body.comment, req.body.username)
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error: ", err);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    ca.rainbow("POST /upload in server!");
    db.writeFileTo(
        config.s3Url + req.file.filename, // send back to browser + img
        req.body.title,
        req.body.description,
        req.body.username
    )
    .then(({ rows }) => {
            res.json({
                image: rows[0]
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});

///////////////////

app.listen(8080, () => ca.rainbow("I am listening, Master"));
