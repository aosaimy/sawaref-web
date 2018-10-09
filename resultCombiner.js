var path = require('path');
var fs = require('fs');

var REDO=false

//
// This file run parser on all raw output based on thier names and return one JSON file to standard output
// params: - output folder of the raw files - input file
//
var outputsFolder = process.argv[2]
// var sourceFile = process.argv[3]

if (!outputsFolder) {
	console.log("usage: node searchInAll.bash outputsFolder");
	process.exit(1);
}

var currentPath = path.dirname(process.mainModule.filename);

var result = {};
var files = fs.readdirSync(outputsFolder);
for(var i in files){
	var file = files[i];
	if(/\.json$/.test(file)){
		try{
			var json = JSON.parse(fs.readFileSync(path.join(outputsFolder,file)));
			result[ file.split(".")[0]] = json;
		}
		catch(e){
			console.error(e)
		}
	}
}
console.log(JSON.stringify(result,0,4));
