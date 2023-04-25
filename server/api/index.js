const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './tmp/uploads');
   },
   filename: function (req, file, cb) {
     cb(null, file.originalname);
   }
 });
 
const upload = multer({ storage: storage });

app.get('/getFiles', (req, res) => {

   // get all files from the uploads folder
   const testFolder = './tmp/uploads/';

   fs.readdir(testFolder, (err, files) => {
      
       files.forEach(file => {
          console.log(file);
       });

       res.send(files);
    });

});


// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
   // split the file in chunks of 1MB
   console.log(req.file);
   // send the response
   res.status(200).json({
       message: 'File uploaded successfully',
         filename: req.file.filename,
         path: req.file.path,
         size: req.file.size,
         mimetype: req.file.mimetype,
         destination: req.file.destination
   });
 });
 


module.exports = app
