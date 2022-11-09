const express = require('express');
const path = require('path')
const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, 'build')));

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT,function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
});