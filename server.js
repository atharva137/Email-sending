const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const hbs = require('hbs');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//require
const User = require('./model/user');
const Mail = require('./model/mail');
let GTOKEN = '';


const JWT_SECRET = "isdhpojhposdfjpowefjpojpojh2094u093shis8yh98 4u093 4u 094u309u3049u0-3u0-233-=i0-3u093 u023r"

const app = express();
const port = process.env.PORT || 3000
//connect yaha se coonect kiye hai moonse se 
//yha add karna hai 
//mongodb+srv://atharva1371:<password>@cluster0.1nmuo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//ok done
//ye wala online rhega 
mongoose.connect('mongodb+srv://atharva1371:Nilima1371@cluster0.1nmuo.mongodb.net/login-app-db?authSource=admin&replicaSet=atlas-1554qt-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})
// ye wala localhost ke liye rhega like for testing 
// mongoose.connect('mongodb://localhost:27017/login-app-db',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//     useCreateIndex:true
// })

console.log(mongoose.connection.readyState);

const viewsPath = path.join(__dirname, '/views-setup');
console.log(viewsPath);

app.use('/',express.static(viewsPath));
app.set('view engine','hbs');

app.use(express.json());
// allowing express to take userInput url
app.use(express.urlencoded({ extended: false }));
app.post('/api/change-password',async (req, res) => {
    console.log(req.body);
    const token = req.body.token;
    const newpassword = req.body.newpassword;

    
	if (!newpassword || typeof newpassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (newpassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

    try{
        const user = jwt.verify(token,JWT_SECRET);
        const _id =  user.id;
        const password =await bcrypt.hash(newpassword,8);

        await User.updateOne({_id},{$set:{password:password}})
        res.json({status:'ok'});
    }catch(error){
        console.log(error);
        res.json({status:'error',error:'invalid access'})
    }
    
    
})

app.post('/api/login',async(req, res)=>{

    console.log(req.body);
    const user =  await User.findOne({emailId: req.body.username}).lean();

    if(!user){
        return res.json({status:'error',error:'Invalid username/password'})
    }

    if(await bcrypt.compare(req.body.password,user.password)){
        const token = jwt.sign(
            { id:user._id,
                username:user.username
            },
            JWT_SECRET
        )
        GTOKEN = token;
        console.log(GTOKEN+" from login");
        return res.json({status:'ok',data:token});         
    }

    res.json({status:'error', error:'Invalid username/password'})
    
});

app.post('/api/signup',async(req,res)=>{
    console.log(req.body);
    const passowrd = await bcrypt.hash(req.body.password,8);

    if (!req.body.username || typeof req.body.username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!req.body.password || typeof req.body.password !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (req.body.password.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	
    
    try{
        const response = await User.create({
            username:req.body.username,
            emailId :req.body.emailId,
            password:passowrd
        })
        console.log('User created successfully',response);
        const token = jwt.sign(
            { 
                username:req.body.username,
            },
            JWT_SECRET
        )
        
        GTOKEN = token;
         console.log(GTOKEN)
        return res.json({status:'ok',data:token}); 
        
    }catch(e){
         
        return res.json({status:'error', error:'username/email id already'})

    }
     res.json({status:'ok'})
})



////////////////////////////////////////////////////////////////////////////

app.post('/sendemail', async (req,res)=>{

    // obj: {
    //     fromemail: 'atharvayawalkar1377@gmail.com',
    //     yourpass: 'Nilima1371',
    //     tomail: 'atharvayawalkar1377@gmail.com',
    //     cc: 'idk',
    //     bcc: 'idk',
    //     subject: 'haoo haoo haoo',
    //     message: 'YOUPOHIOhhoh'
    //   }
    console.log(req.body);
    const token = req.body.token;
    GTOKEN = req.body.token;
    const fromemail = req.body.obj.fromemail;
    const yourpass = req.body.obj.yourpass;
    const tomail = req.body.obj.tomail;
    const cc = req.body.obj.cc;
    const bcc = req.body.obj.bcc;
    const subject = req.body.obj.subject;
    const message = req.body.obj.message;
    // console.log(req.body.token);
    console.log(req.body.obj.yourpass);
    //// ///
    try{
        const user = jwt.verify(GTOKEN,JWT_SECRET);
       
          try{
            const response = await Mail.create({
                username:user.username,
                fromemail:fromemail,
                tomail:tomail,
                subject:subject,
            })
            console.log('Mail created successfully',response);
               
            
        }catch(e){
              
            return res.json({status:'error', error:'username/email id already'})
    
        }
    }catch(error){
        console.log(error);
        res.json({status:'error',error:'invalid access'})
    }
   //////////////////// transporter
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:req.body.obj.fromemail,
            pass:req.body.obj.yourpass,
            
        }
    });

var mailOptions = {
  from: fromemail,
  to: [tomail],
  cc:[req.body.obj.cc],
  bcc:[req.body.obj.bcc],
  subject:subject,
  text: message,
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
       
    }
  });
  

      

      
    
})
app.use(express.json());
// allowing express to take userInput url
app.use(express.urlencoded({ extended: false }));
app.get("/history", async (req, res) => {

   
   
   
   res.render('history',{
        fromemail:example.com ,
        tomail : example.com,
        subject : 'testing',
    })

  });
  


app.listen(port,()=>{
    console.log('sever is started');
})
