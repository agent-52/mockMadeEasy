const express = require("express")
const jwt = require("jsonwebtoken")
const zod = require("zod")

const port = 3000
const JWT_PASSWORD = "12345678910"

const credentialSchema = zod.object({
    userEmail: zod.email(),
    password: zod.string()
})
const users = [
    {
        userEmail: "harkirat@gmail.com",
        password: "123",
        
    },
    {
        userEmail: "raman@gmail.com",
        password: "123321",
        
    },
    {
        userEmail: "priya@gmail.com",
        password: "123321",
        
    }
]

function verifyInput(req, res, next){
    const response = credentialSchema.safeParse(req.body)
    if (response.success) {
        next()
    } else {
        res.status(411).send("your inputs are wrong")
    }
}
function userExists(userEmail, password){
    for (let i = 0; i < users.length; i++) {
        if(users[i].userEmail == userEmail && users[i].password == password){
            return true;
        }
        
    }
    return false;
}

const app = express()
app.use(express.json())

app.get("/", (req, res) =>{
    res.redirect("https://mock-made-easy.vercel.app/")
})
app.get("/home", (req, res) =>{
    const token = req.headers.authorization
    try {
        const decode = jwt.verify(token , JWT_PASSWORD)
        
    } catch (error) {
        res.status(403).send("authentication failed")
    }
    res.redirect("/")
})
app.post("/signIn", verifyInput, (req, res) =>{
    const userEmail = req.body.userEmail
    const password = req.body.password
    if(userExists(userEmail, password)){
        const token = jwt.sign({userEmail: userEmail}, JWT_PASSWORD)
        res.send({token})
    }else{
        res.status(403).send("User is not in out database please signup then login again")
    }
})
app.listen(3000)