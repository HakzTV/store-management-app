require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const jwt = require('jsonwebtoken')
const app = express();
const port = 3000 || process.env.PORT

const posts = [
    {
        username: 'Telvin',
        title: "Post 1"
    },{
        username: 'Heletta',
        title: "Post 2"
    }
]
const users = []
// Middleware
app.use(express.static("public"));
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('view engine', 'ejs');

// to hash a password 1. create salt and hash that password to create a hash 
//Routes
app.get('/',(req, res)=>{
    res.render('home')
} )

app.get('/posts', authenticateToken,  (req, res)=>{
    res.json(posts)
})

app.post('/login', (req, res)=>{
    // Aunthenticating User
    
    const username = req.body.username;
    const password = req.body.password
    const user = {name: username , password: password}
    // Serialisation of a user
   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
res.json({accessToken : accessToken})
})

// middleware auth
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    // spllitting Bearer and token and checking if 
    const token = authHeadder && authHeader.split(' ')[1]
    if(token == null ) return res.sendStatus(401)

    // deserilasation of the user and checking if the token is valid
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403)
    })
}
// app.get('/users',  (req, res)=>{
//     res.json(users)  
// })
// app.post('/users', async (req, res)=>{
//     try {
//         const salt = await bcrypt.genSalt()
//         const hashPassword = await bcrypt.hash(req.body.password, salt)
//         const user = {name: req.body.name ,password: hashPassword}
//         users.push(user)
//         res.status(201).send()
//     } catch {
//         res.status(500).send(ß)
//     }
  
// })

// // 
// app.post('/users/login', async (req, res)=>{
// const user = users.find(user => user.name === req.body.name)
// if(user=== null){
//     return res.status(400).send('Cannot find user')
// }
// // Comparing to see if passwords match
// try {
//    if( await bcrypt.compare(req.body.password ,user.password )){
//     res.send("Sucess")
//    }else{
//     res.send('Not allowed')
//    }
// } catch  {
//     res.status(500).send()
// }
// })
// Port opening
app.listen(port, ()=>{
    console.log("Server is running on port 3000")
}) 