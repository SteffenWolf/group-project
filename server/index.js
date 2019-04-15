require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const aws = require('aws-sdk');
const ctrl = require('./controller')

const app = express();
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000000000000 }
  })
)

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  console.log('server connected');
  app.listen(SERVER_PORT, () =>
    console.log(`listening on server ${SERVER_PORT}`)
  );
});


app.get(`/currentuser`, ctrl.currentUser) //pull user off sessions
app.get(`/profile/:user_id`, ctrl.getProfile) //pull user_id from sessions and name, password, bio, profile pic, email address from body
app.get(`/landingpage`, ctrl.landingPage) //gets all users name profile pic bio and rating
app.get(`/surveypage`, ctrl.surveyQuestions)

app.post(`/login`, ctrl.login) //pull username & password off body
app.post(`/register`, ctrl.register) //pull username & password off body
app.post(`/accountcreation`, ctrl.accountCreation) //pull name, bio, profile image, email address off body
app.put(`/editprofile`, ctrl.updateProfile) //pull user_id from sessions and name, password, bio, profile pic, and email address from body
app.post(`/surveysubmit`, ctrl.surveySubmit) //pull answer val from body
app.post(`/logout`, ctrl.logout)

app.get('/api/sign-s3', (req, res) => {

  aws.config = {
    region: 'us-west-1',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
  
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    console.log(returnData);
    
    return res.send(returnData)
  });
});
