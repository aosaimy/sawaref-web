/**
This file is the server that handle requests via browser. it can be run by: node server.js
params: none
*/
"use strict"
var session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
var uid = require('node-uuid');
var app = express();
var crypto = require('crypto');
var config = require('./config');
var buckwalter = require('buckwalter-transliteration');
buckwalter.bw2utf = buckwalter("bw2utf")
buckwalter.utf2bw = buckwalter("utf2bw")
var http = require("http");
var conllu = require("sawaref-converters").allTools    
var parser = require("xml2js").Parser({
    trim: true,
    // explicitArray: true
});

var LocalStorage = require('node-localstorage').LocalStorage
var storage = new LocalStorage('./scratch');

var list = {
    MT: "ATKS Tagger",
    KH: "AlKhalil",
    AR: "AraComLex",
    EX: "Elixir",
    MD: "Mada",
    MA: "MadaAmira",
    QA: "QAC",
    Raw: "Raw",
    BP: "buckwalter",
    BJ: "javaBW",
    ST: "stanford",
    SW: "Sawalha",
    MR: "MarMoT",
    WP: "Sapa",
    AM: "Amira",
    FA: "Farasa",
};

if (!process.env.SAWAREF_PATH) {
    console.error("SAWAREF_PATH environment variable is not set");
    process.exit(1);
}

var dls = {
    inits: {
        initApp: function() {

            // Add headers
            app.use("/", express.static(path.join(__dirname, 'public')));
            app.use(function(req, res, next) {

                // Website you wish to allow to connect
                res.setHeader('Access-Control-Allow-Origin', '*');

                // Request methods you wish to allow
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

                // Request headers you wish to allow
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                // Set to true if you need the website to include cookies in the requests sent
                // to the API (e.g. in case you use sessions)
                //res.setHeader('Access-Control-Allow-Credentials', true);

                // Pass to next layer of middleware
                next();
            });
            // app.use(bodyParser({limit: '50mb'}));
            app.use(bodyParser.urlencoded({
                limit: '50mb',
                extended: true
            }));
            app.use(bodyParser.json({ limit: '50mb' }));
            app.use(function(err, req, res,next) {
                if(err){
                    console.error(err.stack);
                    res.status(500).send('Something broke!');
                }
                else
                    next(err)
            });
            app.use(session({
                genid: function() {
                    return uid.v4(); // use UUIDs for session IDs
                },
                secret: 'as2d&f,',
                saveUninitialized: false,
                resave: false,
            }))


            app.listen(5001);
            console.log("You can access Sawaref from http:://localhost:5001")
        },
        initPosts: function() {
            //routes
            for (let i in dls.requests) {
                app.post('/' + i, dls.requests[i]);
            }
            for (let i in dls.requestsGet) {
                app.get('/' + i, dls.requestsGet[i]);
            }

        },
    },
    requestsGet: {
        backupData: function(request, res) {
            var id = request.query.id;
            var result = {}
            if (id == "storedAlignment") {
                result = fs.readFileSync("/morpho/backup/storedAlignment.json", { encoding: "utf8" });
            }

            if (id == "checkedSolutions") {
                result = fs.readFileSync("/morpho/backup/checkedSolutions.json", { encoding: "utf8" });
            }


            if (id == "chosedSolutions") {
                result = fs.readFileSync("/morpho/backup/chosedSolutions.json", { encoding: "utf8" });
            }
            return res.send({
                ok: true,
                result: result,
            });
        },
        align: function(request, res) {

            var types = [
                "ru", // rule-based
                "sp", // supervised
                "un", // unsupervised
                "ch", // character-based
                "gs", // gold-standard
                "st" // stem-and-affixes
            ]

            var type = request.query.type;
            var tools = request.query.tools;
            if (!tools)
                return res.send({
                    ok: false,
                    error: "No tools"
                });
            tools = tools.split(":")
            var sorah = parseInt(request.query.sorah);
            var ayah = parseInt(request.query.ayah);


            if (types.indexOf(type) < 0) {
                return res.send({
                    ok: false,
                    error: "No type"
                });
            }
            for (var i in tools) {
                if (!list[tools[i]]) {
                    return res.send({
                        ok: false,
                        error: "tool is not supported"
                    });
                }
            }
            if (isNaN(sorah) || isNaN(ayah))
                return res.send({
                    ok: false,
                    error: "sorah or ayah is not provided"
                });

            var alignFunc = require('../align.js');

            // prepare the data
            var data = "";
            var file = "/morpho/output/unique/" + sorah + "-" + ayah + ".json";
            try {
                data = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
            } catch (e) {
                return res.send({
                    ok: false,
                    error: "Input file:" + file + " does not exist."
                });
            }

            try {
                data = JSON.parse(data);
            } catch (e) {
                return res.send({
                    ok: false,
                    error: "Input file:" + file + " is not a valid JSON file."
                });
            }

            var tagsSimiliarity = {};
            if (type == "ru" || type == "sp") {
                file = "/morpho/sawaref_aligners/tables.json";
                try {
                    tagsSimiliarity = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
                } catch (e) {
                    return res.send({
                        ok: false,
                        error: "Input file:" + file + " does not exist."
                    });
                }

                try {
                    tagsSimiliarity = JSON.parse(tagsSimiliarity);
                } catch (e) {
                    return res.send({
                        ok: false,
                        error: "Input file:" + file + " is not a valid JSON file."
                    });
                }
            }
            return res.send({
                ok: true,
                data: alignFunc.align(sorah + "-" + ayah, tools, data, type, tagsSimiliarity)
            });
        },
    },
    requests: {
        conllu: function(request, res) {
            var r = request.body;
            var argv = r.argv
            if (fs.existsSync('/morpho/conllu/' + r.sorah + "-" + r.ayah)) {
                var d = fs.readFileSync('/morpho/conllu/' + r.sorah + "-" + r.ayah, "utf8")
                return res.send({ ok: true, data: d })
            }

            argv.f = "/morpho/output/unique/" + r.sorah + "-" + r.ayah + ".json"
            if (!fs.existsSync(argv.f))
                return res.send({ ok: false, error: "No such file: " + r.sorah + "-" + r.ayah + ".json" })
            var outstream = conllu.toConllu(argv.f, argv.t, argv)
            console.log("WARNING: TODO");
            whenDone = function(data) {
                res.send({ ok: true, data: data })
                fs.writeFile('/morpho/conllu/' + r.sorah + "-" + r.ayah, data, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });

            }
        },
        guidelines: function(request, res) {
            var r = request.body;
            var guides = ["specialPos", "specialSeg"].map(v => {
                if (fs.existsSync('/morpho/guidelines/' + r.project + "-" + v + ".json")) {
                    r[v] = fs.readFileSync('/morpho/guidelines/' + r.project + "-" + v + ".json", "utf8")
                    try {
                        return { ok: true, data: JSON.parse(r[v]), type: v }
                    } catch (e) {
                        console.error('/morpho/guidelines/' + r.project + "-" + v + ".json", "is not proper JOSN formatted")
                        return { ok: false, error: "Not proper JOSN formatted", type: v }
                    }
                }
                return { ok: false, error: "No such file" + ' /morpho/guidelines/' + r.project + "-" + v + ".json" }
            })
            return res.send({ ok: true, guides: guides })
        },
        save_conllu: function(request, res) {
            var r = request.body;
            if (!/[0-9a-zA-Z]*/.test(r.sorah) || !/[0-9a-zA-Z]*/.test(r.ayah))
                return res.send({ ok: false, error: "Invalid name. only alphanumbers are permitted" })
            fs.writeFile('/morpho/conllu/' + r.sorah + "-" + r.ayah, r.data, (err) => {
                if (err) throw err;
                res.send({ ok: true })
                const add = spawn('git', ["-C", "/morpho/", "add", 'conllu/' + r.sorah + "-" + r.ayah])
                add.stderr.on('data', (data) => {
                    console.log(`stderr: ${data}`);
                });

                add.on('close', () => {
                    // console.log(`child process exited with code ${code}`);
                    const commit = spawn('git', ["-C", "/morpho/", "commit", '-m', "'Automatic save'"])
                    commit.stderr.on('data', (data) => {
                        console.log(`stderr: ${data}`);
                    });
                });


            });
        },
        madamira: function(request, res) {
            var data = request.body;
            var req = http.request({
                url: 'http://localhost',
                port: 8223,
                method: 'POST',
                headers: {
                    // specify how to handle the request, http-request makes no assumptions
                    'content-type': 'application/xml;charset=utf-8'
                }
            }, function(ress) {
                if (ress.statusCode != 200) {
                    console.error("err", "ress.statusCode=", ress.statusCode)
                }
                var xml = []
                ress.on('data', (chunk) => {
                    // console.log(`${chunk}`);
                    xml.push(chunk)
                });
                ress.on('end', () => {
                    parser.parseString(xml.join(""), function(err, result) {
                        // var obj = result.comics;
                        // for(k in obj.publication)
                        // {
                        //    var item = obj.publication[k];
                        //    arr.push({
                        //       id           : item.id[0],
                        //       title        : item.title[0],
                        //       publisher : item.publisher[0],
                        //       genre        : item.genre[0]
                        //    });
                        // }
                        try {

                            var r = {
                                words: result.madamira_output.out_doc[0].out_seg[0].word_info[0].word.map(word => {
                                    if (!word.analysis)
                                        word.analysis = []
                                    var sortedArr = []
                                    var x = {
                                        "id": word.$.id,
                                        "word": word.$.word,
                                        "possibilities": word.analysis.map(a => {
                                            return {
                                                "rank": a.$.rank,
                                                "score": parseFloat(a.$.score),
                                                "diac": a.morph_feature_set[0].$.diac,
                                                "lemma": a.morph_feature_set[0].$.lemma,
                                                "gloss": a.morph_feature_set[0].$.gloss,
                                                "segmentation": [a.morph_feature_set[0].$.prc0,
                                                        a.morph_feature_set[0].$.prc1,
                                                        a.morph_feature_set[0].$.prc2,
                                                        a.morph_feature_set[0].$.prc3,
                                                        a.morph_feature_set[0].$.stem,
                                                        a.morph_feature_set[0].$.enc0,
                                                        a.morph_feature_set[0].$.enc1,
                                                        a.morph_feature_set[0].$.enc2,
                                                        a.morph_feature_set[0].$.enc3
                                                    ]
                                                    .filter(s => { return s != "0" && s != "na" && s !== "" && s !== undefined })
                                                    .map(s => {
                                                        // console.log(s)
                                                        var ss = s.split("_")
                                                        if (ss[1] != "poss" && ss[1] != "pron" && ss[1] != "dobj" && ss[1] != "iobj")
                                                            return buckwalter.bw2utf(ss[0])
                                                        return s
                                                    }),
                                                // .join("+")
                                            }
                                        })
                                    }
                                    x.possibilities.forEach(s => {
                                        sortedArr.push(Object.keys(s).filter(i => i != "score" && i != "rank").map(i => s[i]).join("+"))
                                    })
                                    console.error(sortedArr)
                                    x.possibilities = x.possibilities.filter((s, i) => {
                                        return i == sortedArr.indexOf(sortedArr[i])
                                    })
                                    // TODO fix
                                    // x.possibilities.forEach((s,i)=>
                                    //         s.rank == parseInt(i)
                                    //     })
                                    return x
                                })
                            }
                            res.send({ ok: true, rs: ress.statusCode, body: r })
                        } catch (e) {
                            console.error(e)
                            return res.send({ ok: false, rs: ress.statusCode, body: result })
                        }
                    })
                })
            })
            // console.log(getXML(data.sentence))
            req.write(getXML(data.sentence))
            req.end()

        },
        download: function(request, res) {
            res.setHeader('Content-disposition', 'attachment; filename=download.json');
            res.setHeader('Content-type', 'text/json');
            res.send(request.body);
        },
        check: function(request, res) {
            var data = request.body;
            //var ret = dls.auth.au(data);
            if (!data.uuid)
                return res.send({
                    ok: false,
                    error: "no uuid provided."
                });
            var uuid = data.uuid;
            if (!storage[uuid]) {
                return res.send({
                    ok: true,
                    error: "SessionNotIntilized",
                    reset: true
                });
            } else if (storage[uuid].status == "true") {
                return res.send({
                    ok: true,
                    status: true,
                    date: storage[uuid].date,
                    //reset: true,
                    // results: JSON.parse(fs.readFileSync(storage[uuid].doneFile)),
                    results: JSON.parse(spawnSync("node", ["resultCombiner.js", "/morpho/sawaref/raw/" + storage[uuid].date]).stdout.toString()),

                });

            } else if (storage[uuid].status == "error") {
                return res.send({
                    ok: true,
                    reset: true,
                    date: storage[uuid].date,
                    error: storage[uuid].error
                });
            } else if (storage[uuid].status == "inRunningTools") {
                for (let i in list) {
                    if (storage[uuid][i] !== true && fs.existsSync("/morpho/sawaref/raw/" + storage[uuid].date + "/" + i))
                        storage[uuid][i] = true;
                }
                return res.send({
                    ok: true,
                    date: storage[uuid].date,
                    result: storage[uuid],
                    results: JSON.parse(spawnSync("node", ["resultCombiner.js", "/morpho/sawaref/raw/" + storage[uuid].date]).stdout.toString()),
                    status: storage[uuid].status
                });
            } else if (storage[uuid].status == "doneRunningTools") {
                return res.send({
                    ok: true,
                    date: storage[uuid].date,
                    result: storage[uuid],
                    status: storage[uuid].status
                });
            } else {
                return res.send({
                    ok: true,
                    date: storage[uuid].date,
                    status: storage[uuid].status,
                    error: storage[uuid].error,
                });
            }
        },
        analyze: function(request, res) {

            // Request variables and input validation
            var data = request.body;

            if (!data.text)
                return res.send({
                    ok: false,
                    error: "no text provided."
                });

            /***
             ** Initilizing
             ***/
            // create a new hash string for the text given.
            var uuid = crypto.createHash('md5').update(data.text + "Hammodi").digest('hex');
            var date = uuid;
            if (storage[uuid] && fs.existsSync("/morpho/sawaref/json/" + date)) {
                request.body.uuid = uuid;
                return dls.requests.check(request, res);
            }
            storage[uuid] = {
                file: "/morpho/sawaref/input/" + date,
                status: "notStarted",
                date: date,
            }
            var f = fs.writeFileSync("/morpho/sawaref/input/" + date, data.text.trim());
            if (f) {
                storage[uuid].status = "errorWritingToFile";
                // storage[uuid].error = error;
                throw storage[uuid].status;
            }

            /***
             ** Running Tools
             ***/

            storage[uuid].status = "inRunningTools";

            console.log(uuid + ":\tRunning " + process.env.SAWAREF_PATH + "/ArabicMorphologyCommands.sh");
            var child = spawn(process.env.SAWAREF_PATH + "/ArabicMorphologyCommands.sh", ["/morpho/sawaref/input/" + date, "/morpho/sawaref/raw/" + date], {
                //stdio:['ipc'] //enable ipc channel
            })
            child.stdout.on('data', function(data) {
                process.stdout.write(data.toString('utf8'));
            });
            child.on("error", function(error) {
                storage[uuid].status = "errorRunningTools";
                storage[uuid].error = error;
                child.stderr.pipe(process.stderr);
                child.stdout.pipe(process.stdout);
                throw error;
            });
            /***
             ** Parsing
             ***/
            child.on('exit', function(code) {
                console.log(uuid + ':\tChild exited with code ' + code);
                if (code !== 0) {
                    storage[uuid].status = storage[uuid].error = "errorRunningTools:NotExitProperly";
                    return;
                }
                storage[uuid].status = "doneRunningTools";

                console.log(uuid + ":\tRunning " + process.env.SAWAREF_PATH + "/searchInAll.bash");
                var newChild = spawn(process.env.SAWAREF_PATH + "/searchInAll.bash", ["/morpho/sawaref/raw/" + date, "/morpho/sawaref/input/" + date]);
                //stdout.pipe(newChild.stdin);

                newChild.on("error", function(error) {
                    console.log(uuid + ":\terrorRunningParser");
                    storage[uuid].status = "errorRunningParser";
                    storage[uuid].error = error;
                });
                newChild.stderr.on('data', function(data) {
                    process.stderr.write(data.toString('utf8'));
                });
                newChild.stdout.on('data', function(data) {
                    process.stdout.write(data.toString('utf8'));
                });
                newChild.on("exit", function(code) {

                    console.log(uuid + ':\tnewChild exited with code ' + code);
                    storage[uuid].status = "true";
                    storage[uuid].doneFile = "/morpho/sawaref/json/" + date;
                    newChild.stdout.pipe(fs.createWriteStream("/morpho/sawaref/json/" + date));
                    if (code !== 0) {
                        storage[uuid].status = "errorRunningTools:NotExitProperly";
                        return res.send({
                            ok: true,
                            status: storage[uuid].status,
                            reset: false,
                        });
                    }
                });
            });
            return res.send({
                ok: true,
                done: false,
                uuid: uuid
            });

        },
        saveFile: function(request, res) {
            var data = request.body;
            fs.writeFileSync("/morpho/sawaref/" + data.sorah + "-" + data.ayah + ".json", JSON.stringify(data.data, null, 4), {
                encoding: "utf8"
            });
            console.log(data);
            return res.send({
                ok: true,
            });
        },
        backupData: function(request, res) {
            var data = request.body;
            var d = new Date();
            var date = (d.getYear() + 1900) + "" + (d.getMonth() + 1) + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes();

            fs.renameSync("/morpho/backup/storedAlignment.json",
                "/morpho/backup/storedAlignment" + date + ".json");
            fs.writeFileSync("/morpho/backup/storedAlignment.json",
                JSON.stringify(JSON.parse(data.storedAlignment), null, 4), {
                    encoding: "utf8"
                });

            fs.renameSync("/morpho/backup/checkedSolutions.json",
                "/morpho/backup/checkedSolutions" + date + ".json");
            fs.writeFileSync("/morpho/backup/checkedSolutions.json",
                JSON.stringify(JSON.parse(data.checkedSolutions), null, 4), {
                    encoding: "utf8"
                });

            fs.renameSync("/morpho/backup/chosedSolutions.json",
                "/morpho/backup/chosedSolutions" + date + ".json");
            fs.writeFileSync("/morpho/backup/chosedSolutions.json",
                JSON.stringify(JSON.parse(data.chosedSolutions), null, 4), {
                    encoding: "utf8"
                });
            // console.log(data);
            return res.send({
                ok: true,
            });
        },
        analyzeAyah: function(request, res) {

            var data = request.body;
            //var ret = dls.auth.au(data);
            if (!data.sorah)
                return res.send({
                    ok: false,
                    error: "no text provided."
                });
            var text = ""
            //ALL 
            var da = {}
            if (!data.ayah) {
                if (fs.existsSync("/morpho/concatenated/" + data.sorah + ".unique.json")) {
                    text = fs.readFileSync("/morpho/concatenated/" + data.sorah + ".unique.json", {
                        encoding: "utf8"
                    });
                    try {
                        da = JSON.parse(text)
                    } catch (e) {
                        da = {
                            error: "not JSON"
                        };
                    }
                    res.send({
                        sorah: data.sorah,
                        data: da,
                    });
                }
                return;
            }
            var type = {};
            if (fs.existsSync("/morpho/sawaref222/" + data.sorah + "-" + data.ayah + ".json")) {
                text = fs.readFileSync("/morpho/sawaref222/" + data.sorah + "-" + data.ayah + ".json", {
                    encoding: "utf8"
                });
                type.type = "sawaref"
            } else if (data.align && data.tools &&
                fs.existsSync("/Users/abbander/Leeds/ArabicMorphologyTools/bin/weka-" + data.align + "-" +
                    config.toolspairsFn(data.tools) + "/" + data.sorah + "-" + data.ayah + ".json")) {
                text = fs.readFileSync("/Users/abbander/Leeds/ArabicMorphologyTools/bin/weka-" + data.align + "-" + config.toolspairsFn(data.tools) + "/" + data.sorah + "-" + data.ayah + ".json", {
                    encoding: "utf8"
                });
                type.tools = data.tools
                type.align = data.align
            } else if (fs.existsSync("/morpho/output/" + data.sorah + "-" + data.ayah + "/UNIQ.json")) {
                text = fs.readFileSync("/morpho/output/" + data.sorah + "-" + data.ayah + "/UNIQ.json", {
                    // var text = fs.readFileSync("/morpho/output-disambg/" + data.sorah + "-" + data.ayah + ".json", {
                    encoding: "utf8"
                });
                type.source = "/morpho/output/unique/"
                type.toolsnotfound = config.toolspairsFn(data.tools)
            } else
                return res.send({
                    ok: false,
                    error: "500 File not exist.",
                });
            
            da = {}
            try {
                da = JSON.parse(text)
            } catch (e) {
                console.error(e.stack);
                da = {
                    stack: e.stack,
                    error: "not JSON"
                };
            }
            var obj = {};
            obj[data.sorah + "-" + data.ayah] = da;

            res.send({
                sorah: data.sorah,
                ayah: data.ayah,
                data: obj,
                type: type
            });
        },
    },
    func: {
        isInt: function(x) {
            return (typeof x === 'number' && (x % 1) === 0);
        },
    },
    init: function() {
        for (let i in dls.inits) {
            dls.inits[i].call();
        }
    }
};
dls.init();


function getXML(sentence) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<madamira_input xmlns="urn:edu.columbia.ccls.madamira.configuration:0.1">
    <madamira_configuration>
        <preprocessing sentence_ids="false" separate_punct="true" input_encoding="UTF8"/>
        <overall_vars output_encoding="UTF8" dialect="MSA" output_analyses="ALL" morph_backoff="NONE"/>
        <requested_output>
            <req_variable name="PREPROCESSED" value="false" />
            <req_variable name="STEM" value="true" />
            <req_variable name="GLOSS" value="true" />
            <req_variable name="LEMMA" value="true" />
            <req_variable name="DIAC" value="true" />
            <req_variable name="ASP" value="false" />
            <req_variable name="CAS" value="false" />
            <req_variable name="ENC0" value="true" />
            <req_variable name="ENC1" value="true" />
            <req_variable name="ENC2" value="true" />
            <req_variable name="GEN" value="false" />
            <req_variable name="MOD" value="false" />
            <req_variable name="NUM" value="false" />
            <req_variable name="PER" value="false" />
            <req_variable name="POS" value="false" />
            <req_variable name="PRC0" value="true" />
            <req_variable name="PRC1" value="true" />
            <req_variable name="PRC2" value="true" />
            <req_variable name="PRC3" value="true" />
            <req_variable name="STT" value="false" />
            <req_variable name="VOX" value="false" />
            <req_variable name="BW" value="false" />
            <req_variable name="SOURCE" value="false" />
            <req_variable name="NER" value="false" />
            <req_variable name="BPC" value="false" />
        </requested_output>
        <tokenization>
            <scheme alias="MyD3">
                <scheme_override alias="MyD3"
                                 form_delimiter="\u00B7"
                                 include_non_arabic="true"
                                 mark_no_analysis="true"
                                 token_delimiter=" "
                                 tokenize_from_BW="false">
                    <split_term_spec term="PRC3"/>
                    <split_term_spec term="PRC2"/>
                    <split_term_spec term="PART"/>
                    <split_term_spec term="PRC0"/>
                    <split_term_spec term="REST"/>
                    <split_term_spec term="ENC0"/>
                    <token_form_spec enclitic_mark="+"
                                     proclitic_mark="+"
                                     token_form_base="WORD"
                                     transliteration="UTF8">
                        <normalization type="ALEF"/>
                        <normalization type="YAA"/>` +
        // <normalization type="DIAC"/>
        `<normalization type="LEFTPAREN"/>
                        <normalization type="RIGHTPAREN"/>
                    </token_form_spec>
                </scheme_override>
            </scheme>
        </tokenization>
    </madamira_configuration>

    <in_doc id="ExampleDocument">
        <in_seg id="SENT1">` +
        sentence +
        `</in_seg>
    </in_doc>

</madamira_input>`
}