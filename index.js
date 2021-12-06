var dh_querier = require('datahub-querier');
const express = require('express');
const path = require('path');
var fs = require('fs');

const PORT = process.env.PORT || 8080;

const app = express(); 
var querier = new dh_querier();

//results base formatting
var resultsJson = JSON.parse('{}');
resultsJson['credits'] = "Antonio Giulio, Maria Angela Pellegrino"

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    console.log('Homepage');
    fs.readFile('homepage.html', (err, data) => {
        res.write(data);
        res.end();
    })
});

app.get('/brutalSearch', (req, res) => {
    console.log('brutalSearch');
    
    //url formatting
    const myURL = new URL(req.url, 'https://127.0.0.1:'+PORT);
    console.log(myURL);
    var keyword = myURL.searchParams.get('keyword');
    var rankingMode = myURL.searchParams.get('rankBy');
    var body;

    //query
    if(myURL.searchParams.has('returnOnly')){
        var outTags = myURL.searchParams.get('returnOnly').split(',');
        body = querier.filterResults(querier.brutalSearch(keyword, rankingMode), ...outTags);
        
    }else{
        body = querier.brutalSearch(keyword, rankingMode);
    }    

    //response formatting
    res.set('Content-Type', 'application/json');
    resultsJson['keyword'] = keyword;
    resultsJson['tags'] = null;
    if(rankingMode === null){
        resultsJson['ranking'] = 'name';
    }else{
        resultsJson['ranking'] = rankingMode;
    }
    resultsJson['numOfResults'] = Object.keys(body).length;
    resultsJson['results'] = body;

    res.write(JSON.stringify(resultsJson, null, 2));
    res.end();
});

app.get('/multiTagSearch', (req, res) => {
    console.log('multiTagSearch');
    
    //url formatting
    const myURL = new URL(req.url, 'https://127.0.0.1:'+PORT);
    console.log(myURL);
    var keyword = myURL.searchParams.get('keyword');
    var tags = myURL.searchParams.get('tags').split(',');
    var rankingMode = myURL.searchParams.get('rankBy');
    var body;

    //query
    if(myURL.searchParams.has('returnOnly')){
        var outTags = myURL.searchParams.get('returnOnly').split(',');
        body = querier.filterResults(querier.multiTagSearch(keyword, ...tags, rankingMode), ...outTags);
        
    }else{
        body = querier.multiTagSearch(keyword, ...tags, rankingMode);
    }

    //response formatting
    res.set('Content-Type', 'application/json');
    resultsJson['keyword'] = keyword;
    resultsJson['tags'] = tags;
    if(rankingMode === null){
        resultsJson['ranking'] = 'name';
    }else{
        resultsJson['ranking'] = rankingMode;
    }
    resultsJson['numOfResults'] = Object.keys(body).length;
    resultsJson['results'] = body;

    res.write(JSON.stringify(resultsJson, null, 2));
    res.end();
});

app.listen(PORT, function(){
    console.log('listening on '+ PORT + ' port!');
})