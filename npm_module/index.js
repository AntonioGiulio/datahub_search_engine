const http_tool = require ('xmlhttprequest').XMLHttpRequest;
const fs = require('fs');
var datasets = require("./datahub.json");



class DH_Querier {

    constructor() {
         //se il file è vuoto (o obsoleto) dobbiamo aggiornarlo
        
    }

    brutalSearch(target){
        var results = JSON.parse('[]');
        var i = 0;
        var field;
        const pattern =new RegExp(target, 'i');
        console.log(pattern);
        for(let d in datasets){
            field = JSON.stringify(datasets[d]);
            if(pattern.test(field))
                results[i++] = datasets[d];
        }

        return results;
    }

    tagSearch(target, tag){
        var results = JSON.parse('[]');
        var i = 0;
        var field;
        const pattern = new RegExp(target, 'i');
        for(let d in datasets){
            field = JSON.stringify(datasets[d][tag]);
            if(pattern.test(field))
            results[i++] = datasets[d];
        }

        return results;
    }

    multiTagSearch(target, ...tags){
        var results = JSON.parse('[]');
        var i = 0, j;
        var field;
        const pattern = new RegExp(target, 'i');
        console.log(pattern);
        for(let d in datasets){
            field = '';
            for(j in tags){
                field += JSON.stringify(datasets[d][tags[j]]);
            }
            if(pattern.test(field)){
                results[i++] = datasets[d];
            }
        }

        return results;
    }

    filterResults(results, ...tags){
        var filteredResults = JSON.parse('[]');
        var j, z = 0;
        console.log(tags);
        for(let d in results){
            var singleInstance = JSON.parse('{}');
            for(j in tags){
                singleInstance[tags[j]] = results[d][tags[j]];
            }
            filteredResults[z++] = singleInstance;
        }

        return filteredResults;
    }

    sortResultBySize(results){
        console.log('Size ranking');       

        results.sort(function(a,b){ 
            var triples_a = 0;
            var triples_b = 0;
            for (var data in a.extras){
                if(a.extras[data].key === 'triples')
                    triples_a = a.extras[data].value; 
            }
            for (var data in b.extras){
                if(b.extras[data].key === 'triples')
                    triples_b = b.extras[data].value;
            }
            return triples_b - triples_a});

        return results;
    }

    sortResultByName(results){
        console.log('Alphabetic ranking');

        results.sort(function(a, b){
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            if(x < y) {return -1;}
            if(x > y) {return 1;}
            return 0;
        });

        return results;
    }

    //rendiamo il processo di creazione del file JSON gigante una funzione 
    updateDatasets(){
        var request = new http_tool();
        this.datasets = JSON.parse('[]');
        var start = 0;
        for(var i = 0; i < 12; i++){
            request.open('GET',  "https://old.datahub.io/api/3/action/package_search?&rows=100000&start=" + start, false);
            request.send();

            if(request.status === 200){
                console.log("request n':" + i + " response: " + request.status);
                var currentDS = JSON.parse(request.responseText)['result']['result'];
                var j = 0;
                for(let data in currentDs){
                    this.datasets[(j++)+start] = currentDS[data];
                }
            }
            start += 1000;
        }
        fs.writeFile('datahub.json', JSON.stringify(this.datasets), function(err) {
            if (err) return console.log(err);
            console.log('File updated');
        });
    }
}

const querier = new DH_Querier();
/*
// testiamo i vari metodi implementati
fs.writeFile('brutalSearchRes.json', JSON.stringify(querier.brutalSearch('amsterdam')), function(err) {
    if (err) return console.log(err);
    console.log('File written');
});

fs.writeFile('tagSearchRes.json', JSON.stringify(querier.filterResults(querier.tagSearch('culturalheritage', 'tags'), 'id', 'title', 'name')), function(err) {
    if (err) return console.log(err);
    console.log('File written');
});*/

/*
fs.writeFile('sizeSortingTest.json', JSON.stringify(querier.filterResults(querier.sortResultBySize(querier.brutalSearch('amsterdam')), 'id', 'title', 'name', 'extras')), function(err) {
    if (err) return console.log(err);
    console.log('File written');
});*/

fs.writeFile('nameSortingTest.json', JSON.stringify(querier.filterResults(querier.sortResultByName(querier.brutalSearch('amsterdam')), 'name')), function(err) {
    if (err) return console.log(err);
    console.log('File written');
});

//console.log(JSON.stringify(querier.sortResultBySize(querier.brutalSearch('amsterdam'))));