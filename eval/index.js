const express =require("express")
const fs=require("fs")
const { v4: uuidv4 } = require('uuid');
const App=express()

const val=uuidv4()

App.use(express.urlencoded({extended:true}));
App.use(express.json())

App.use("/votes",(req,res,next)=>{
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const newdata=JSON.parse(data)

        let flag=false;
        newdata.users=newdata.users.map((ele)=>{
            if(ele.token)
            {
                flag=true;
                return ele
            }
            else
            {
                return ele
            }
        })
        if(flag==false)
        {
            res.status(401).send("user not authenticated")
        }
        const validity=req.query
        if(!validity.apikey)
        {
            res.status(401).send("user not authenticated")
        }
    next()
})
})

App.post("/create",(req,res)=>{
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const newdata=JSON.parse(data)
        newdata.users=[...newdata.users,{...req.body,"id":val}]

        fs.writeFile("./db.json",JSON.stringify(newdata),()=>{
            res.status(201).send(`{status: usercreated, id of user:${val}}`)
        })
    })
})

App.post("/login",(req,res)=>{
    if(req.body.username =="undefined" || req.body.password =="undefined")
    {
        res.status(404).send(`{ status: "please provide username and password" }`)
    }
    else
    {
        fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
            const newdata=JSON.parse(data)
            let flag=false;
            newdata.users=newdata.users.map((ele)=>{
                if(ele.username==req.body.username && ele.password==req.body.password)
                {
                    flag=true
                    return {...ele,"token":"6f85ecaobc"}
                }
                else
                {
                    return ele
                }
            })
            if(flag==false)
            {
                return res.status(401).send(`{ status: "Invalid Credentials" }`)
            }

            fs.writeFile("./db.json",JSON.stringify(newdata),()=>{
                res.status(201).send(`{ status: "Login Successful", token:6f85ecaobc }`)
            })
        })
    }
})

App.get("/votes/:voters",(req,res)=>{
    const{voters}=req.params
    console.log(voters)
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const newdata=JSON.parse(data)
        let flag=false;
        newdata.users=newdata.users.filter((ele)=>ele.role==voters)

        console.log(newdata.users)
        res.send(newdata.users)
    })

})

App.get("/votes/party/:party",(req,res)=>{
    const{party}=req.params
    console.log(party)
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const newdata=JSON.parse(data)
        let flag=false;
        newdata.users=newdata.users.filter((ele)=>ele.party==party)

        console.log(newdata.users)
        res.send(newdata.users)
    })

})

App.post("/votes/count/:name",(req,res)=>{
    const{name}=req.params
    console.log(name)
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const newdata=JSON.parse(data)
        let flag=false;
        let data11=0;
        newdata.users=newdata.users.map((ele)=>{
            if(ele.name==name && ele.role=="candidates")
            {
                flag=true
                ele.vote=ele.vote+1;
                data11=ele.vote;
                return ele
            }
            else
            {
                return ele
            }
        })

        if(flag==false)
        {
            res.send(`{ status: "cannot find user" }`)
        }

        fs.writeFile("./db.json",JSON.stringify(newdata),()=>{
            res.send(`{ status: ${data11} }`)
        })
    // res.send("sodne")
    })

})

App.post("/logout",(req,res)=>{

        fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
            const newdata=JSON.parse(data)
  
            newdata.users=newdata.users.map((ele)=>{
                if(ele.token)
                {
                    delete ele.token
                    return ele
                }
                else
                {
                    return ele
                }
            })

            fs.writeFile("./db.json",JSON.stringify(newdata),()=>{
                res.status(201).send(`{ status: user logged out successfully }`)
            })
        })
    })

    
    App.get("/",(req,res)=>{

        fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
            const newdata=JSON.parse(data)

            res.status(201).send(newdata)
        })
    })

const port =process.env.PORT || 8080
App.listen(port,()=>{
    console.log("server started")
})