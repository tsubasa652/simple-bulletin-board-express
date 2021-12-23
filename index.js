const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("post.db")
const express = require("express")
const app = express()
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR,
        body VARCHAR,
        time TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'+9 hours'))
    )`)
})

app.get('/', (req, res) => {
  db.all("select * from posts", (err, posts) => {
    res.render("index.ejs", {posts})
  })
})

app.post('/post', (req, res) => {
  try{
    console.log(req.body)
    const keys = Object.keys(req.body)
    console.log(keys)
    if(!keys.includes("name") || !keys.includes("body") || req.body["name"] == "" || req.body.body == ""){
      throw new Error("名前または本文が入力されていません")
    }
    db.run("INSERT INTO posts(name, body) VALUES(?, ?)", [req.body.name, req.body.body], (err) => {
      if(err) throw new Error("エラーが発生しました")
      res.render("post.ejs", {msg: "メッセージを投稿しました"})
    })
  }catch(e){
    res.render("post.ejs", {msg: e.message})
  }
})

app.listen(3000, () => {
  console.log('server started');
});
