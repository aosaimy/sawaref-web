angapp.controller('MainController', function($scope, $route, $routeParams, $location, $rootScope, $http, $log, Pages, QuranData, Tools, allData) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.$log = $log;

    $scope.config = config;


    $scope.task = $routeParams.task || "pos";
    $scope.sorahNav = {};


    var typeaheadData = [];
    for (var i in QuranData)
        typeaheadData.push({
            id: i,
            name: (parseInt(i) + 1) + ": " + QuranData[i][5]
        });
    $sorahNo = $("#sorahNo");
    $sorahNo.typeahead({
        source: typeaheadData,
    });


    $scope.downloadAllResult = function() {
        var blob = new Blob([JSON.stringify(allData)], {
            type: "text/json"
        });
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)
    }
    $scope.uploadAllResult = function(sorah,ayah,e) {
        // console.log(allData);
        $http.post(config.serverName + "/saveFile", {
            sorah: sorah,
            ayah: ayah,
            data: allData[sorah+"-"+ayah],
        }).then(function(d) {
            console.log(d);
        });

        // var e = jQuery.Event("keydown");
        // e.which = 73; // # i
        // $(document).trigger(e)
    }
    $scope.$on('myerrors', function(event, args) {

        // do what you want to do
        $scope.errorMsg = args.error;
        if(args.error)
            console.log("myerrors"+args.error);
    });

    $scope.doExperiment = function(e) {
        // $location.path("/analyse/morphemes/29/"+"14");
        for (var i = 1; i <= 3 ; i++){
            $location.path("/analyse/morphemes/29/"+i);
        }
        for (var i = 1; i <= 3 ; i++){
            
        }
    }
    $scope.saveCSV = function(sorah,ayah,task,e) {
        var download = false;
        var text = "";
        $("#results tbody").each(function(i,a){
            $(a).children("tr").each(function(j,b){
                var rows = [];
                var utf8 = [];
                var num = "";
                var id = "";
                $(b).children("td:visible").each(function(k,c){
                    id = $(c).attr("id");
                    if($(c).hasClass("num")){
                        num=$(c).text();
                    }
                    $(c).children("span.utf8Word").each(function(l,d){
                        utf8[l] = $(d).text().trim();
                    });
                    $(c).children("span.analyses").children("a").each(function(l,d){
                        if(!rows[l])
                            rows[l] = [];
                        if($(d).hasClass("incorrect"))
                            rows[l].push("XXXXX")
                        else
                            rows[l].push($(d).text().trim())
                    })
                    //the case utf8 is not split enough
                    // while(utf8.length < rows.length){
                    //     utf8.push("--!--");
                    // }
                    if($(c).children("span.error:visible").length > 0){
                        for(var l in utf8){
                            if(!rows[l])
                                rows[l] = [];
                            rows[l].push("ERR")
                        }
                    }
                })
                var counter = 0;
                for (var k in rows){
                    while(rows[k].length != Tools.list.length){
                        // console.error(rows[k],id);
                        rows[k].unshift("ERR")
                    }
                    var tmp = rows[k].join(",")
                        .replace(/-----/g,"")
                        .replace(/ERR/g,"")
                        .replace(/▐/g,"")
                        .replace(/XXXXX/g,"");
                    if(tmp == ",,,"){
                        // console.error("skipped",rows[k]);
                        continue;
                    }
                    else{
                        // console.warn(tmp);
                    }
                    text += num+"-"+ counter + ",";
                    text += (utf8[counter] || "") + ",";
                    text += rows[k].join(",");
                    text += "\n";

                    counter++;
                }
            })
        })
        text = text.replace(/▐/g,"");
        console.log(text);
        // return;
        var blob = new Blob([text], {
            type: "text/json"
        });
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = sorah+"-"+ayah+"-"+task+".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)
    }
    $scope.backupData = function(e) {
        $http.post(config.serverName + "/backupData", {
            checkedSolutions: localStorage.checkedSolutions,
            storedAlignment: localStorage.storedAlignment,
            chosedSolutions: localStorage.chosedSolutions,
        }).then(function(d) {
            console.log(d);
        });
    }

    ///////////////////////////
    ///////////////////////////
    $scope.pages = Pages.data;
});

angapp.controller('AnalysisController', function($scope, $routeParams, $rootScope, $timeout, $location, $http, Pages, QuranData, allData, Data, chosedSolutions, checkedSolutions, Tools, Translation, Utils, TagsSimiliarity) {
    $scope.task = $routeParams.task || "pos";
    $scope.whattask = Pages.data[$scope.task].charAt(0)=="-"  ?  "feature" : $scope.task;
    $scope.sorah = $routeParams.s || 29;
    $scope.ayah = $routeParams.a || null;
    
    $scope.alignp = $routeParams.align;
    $scope.toolsp = $routeParams.tools;

    $scope.errMsg = "";

    $scope.showHelp = false;

    $rootScope.$broadcast('myerrors',{error: ""});
    // $("#feature li a[href=" + $scope.task + "]").trigger("click")
    $scope.ayaCount = 10;
    if (QuranData[$scope.sorah - 1])
        $scope.ayaCount = QuranData[$scope.sorah - 1][1] || 10;

    $scope.$parent.sorahNav.sorah = $scope.sorah;
    $scope.$parent.sorahNav.ayah = $scope.ayah;
    $scope.$parent.sorahNav.ayaCount = $scope.ayaCount;
    $scope.$parent.sorahNav.task = $scope.task;
    $scope.$parent.sorahNav.alignp = $scope.alignp;
    $scope.$parent.sorahNav.toolsp = $scope.toolsp;
    var storedAlignment = {}
    try{
        // var storedAlignment = {}
        var storedAlignment = JSON.parse(localStorage.storedAlignment);
    }
    catch(e){
        $http.get(config.serverName + "/backupData?id=storedAlignment").then(function(d) {
            storedAlignment = JSON.parse(d.result);
            localStorage.storedAlignment = d.result;
            location.reload();
        });
    }
    // DONT DO THIS: allData = Data; IT WILL ERASE THE ORIGINAL OBJ
    for(var i in Data)
        allData[i] = Data[i];
    
    var firstKey = "";
    for (firstKey in Data) break;


    var getTableHeads = function() {
        var arr = []
        for (var j in Tools.list) {
            if ($scope.task == "disambig" && !Tools.MAs[Tools.list[j]]){
                continue;
            }
            if (allData[firstKey][Tools.list[j]] && allData[firstKey][Tools.list[j]].length > 0) // only process the taggers in the list
                arr.push(Tools.list[j])
        }
        return arr;
    };

    $scope.align = function() {
           tools_to_align = ["ST","AM","FA","SW"];
           $scope.aligno();
    }
    var tools_to_align = ["MD", "MA","QA","SW"];
    $scope.aligno = function() {
        // var tools_to_align = ["BP","BJ", "MD", "MA","WP","AM","QA","SW", "ST","MR","EX"];
        $.get(config.serverName + "/align", {
            "sorah": $scope.sorah,
            "ayah": $scope.ayah,
            "tools": tools_to_align.join(":"),
            "type": "st",
        }, function(result) {
            var d = allData[$scope.sorah+"-"+$scope.ayah];
            // console.log(d);
            if(!result.ok){
                $scope.errorMsg = result.error;
                return "error! TODO";
            }
            console.log(result);
            var data = result.data.lines;
            for(var wid in data){
                for(var tool in result.data.tools){
                    var word = d[result.data.tools[tool]][wid];
                    if(!word){
                        console.log(word,result.data.tools[tool],wid,"is undefined");
                        return;
                    }
                    if(word.error)
                        continue;
                    if(word.choice == undefined)
                        continue
                    var morphemes = []
                    var counter = 0;
                    var new_morphemes = []
                    
                    if(data[wid][0] && data[wid][0][tool] == "E")
                       continue;

                   for(var i in word.analyses[word.choice].morphemes)
                       // if it was previouslly aligned
                        if(word.analyses[word.choice].morphemes[i].pos != "-----")
                            morphemes.push(word.analyses[word.choice].morphemes[i])

                    for(var mid in data[wid]){
                       if(data[wid][mid][tool] == "X")
                            new_morphemes.push({pos: "-----",})
                        // else if(data[wid][mid][tool] == "O")
                        //     new_morphemes.push({pos: "-----",})
                        else
                            new_morphemes.push(morphemes[data[wid][mid][tool]])
                    }
                    console.log(new_morphemes);
                    word.analyses[word.choice].morphemes = new_morphemes;
                }
            }
            $scope.datas[$scope.ayah] = transposeData($scope.task, allData, $scope.ayah, $scope.tableHeads);
            $scope.$apply();
        }).error(function(e){
            $scope.errorMsg = e;
        })
    }

    $scope.tools = Tools;
    $scope.tableHeads = getTableHeads();

    $scope.selectedCell = {
        sorah: $scope.sorah,
        ayah: $scope.ayah,
        wid: 0,
        aid: 0,
        tid: 0,
        morphemes: [],
        allData: {},
    };

    if(!$scope.ayah){
        // console.log(angular.element("body"));
        angular.element("body").removeClass("screening").addClass("printing");
    }
    else
        angular.element("body").removeClass("printing").addClass("screening");

    $scope.onAnalyseFormSubmit = function() {
        var text = $("#analyze input").val();
        if (!textsUUIDs[text]) {
            $.post(serverName + "/analyze", $(this).serialize(), function(data) {
                if (data.ok) {
                    textsUUIDs[text] = data.uuid;
                    if (data.status == true) {
                        allData = {
                            0: preprocess(data.results)
                        };
                        $("#feature li.active a").trigger("click");
                        if (inter) {
                            clearInterval(inter);
                            inter = false;
                        }
                    } else if (!inter) {
                        inter = setInterval(check, 5000);
                    }
                } else {
                    alert("Server responded with no data!");
                    console.log("nothing");
                }
            }, "json").fail(function() {
                alert("Error: something went wrong. Server is not accessible maybe.");
            });
        } else {
            check();
        }
        return false;
    };

    $scope.trans = Translation;
    $scope.check = function check() {
        var text = $("#analyze input").val();
        if (textsUUIDs[text]) {
            $.post(serverName + "/check", {
                uuid: textsUUIDs[text]
            }, function(data) {
                if (data.ok) {
                    console.log(data);

                    if (data.status == true) {
                        allData = {
                            0: preprocess(data.results)
                        };
                        $("#feature li.active a").trigger("click");
                        if (inter) {
                            clearInterval(inter);
                            inter = false;
                        }
                        $("#status").show().addClass("alert-success").removeClass("alert-info").html("Done!");
                    } else if (data.status == "inRunningTools") {
                        allData = {
                            0: preprocess(data.results)
                        };
                        $("#feature li.active a").trigger("click");
                        var t = "";
                        for (var j in list) {
                            if (data.result[j])
                                t += '<span style="color:green"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>' + list[j] + "</span>";
                            else
                                t += '<span style="color:red"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + list[j] + "</span>";
                        }

                        $("#status").show().addClass("alert-info").removeClass("alert-info").html(t);
                    } else if (data.error == "SessionNotIntilized" && data.reset) {
                        textsUUIDs[text] = "";
                        $("#analyze").submit();
                    } else if (data.error) {
                        $("#status").show().addClass("alert-danger").removeClass("alert-info").html(data.error);
                        if (inter) {
                            clearInterval(inter);
                            inter = false;
                        }
                    } else {
                        $("#status").show().addClass("alert-warning").removeClass("alert-info").html(data.status);
                    }
                    if (data.reset) {
                        textsUUIDs[text] = "";
                    }
                } else {
                    alert("Server responded with no data!");
                    console.log("nothing");
                }
            }, "json").fail(function() {
                $("#status").show().addClass("alert-danger").removeClass("alert-info").html("Error: something went wrong. Server is not accessible maybe.");
                clearInterval(inter);
                inter = false;
            });
        }
    }

    var sim_table_tmp = [];

    var transposeData = function(feature, allData, ayahId, list) {
        // This function transpose the data: from having tools with multiple words 
        // TO a word with multiple anlysis from different tools
        // IN ADDITION:
        // -- It choose the most probable analysis based on edit distance.
        // -- It format the word and color its morphemes
        var result = [];
        // for (var ayahId in allData) { // for every ayah
        // var d = allData[ayahId];
        var d = allData[$scope.sorah+"-"+ayahId];
        var whichRaw = d["RawSeg"] ? "RawSeg" : d["RawDia"] ? "RawDia" : "Raw";;
        //delete me
        // f = []
        // for (var i in d.Raw) { // for every word
        //     // f.push(d.Raw[i]);
        //     f.push(d.Raw[i]);
        // }
        // d.Raw = f;
        sall = angular.fromJson(localStorage.rowlimit) || []

        var al_morphemes_count = 0
        for (var i in d[whichRaw]) { // for every word
            var al_morphemes_wordcount = 0
            if(sall.length > 0 && sall.indexOf(parseInt(i)) < 0)
                continue;
            var oneWordData = {
                tools: {},
                num: $scope.sorah+"-"+ayahId + "-" + i,
            };
            // oneWordData.feature = feature;
            for (k in list) {
                if(feature == "disambig" && !Tools.MAs[list[k]]) // to keep only morphological analysers
                    continue;
                oneWordData.tools[list[k]] = {};
            }
            var word = [];
            if (d.QA) {
                var counter = 0;
                if (!d["QA"][i]) {
                    // console.error(d.Raw[i], "no prefix", d["QA"]);
                    word.push("ERROR: no prefix in QAC at index ", i);
                }
                else if (!d["QA"][i].analyses || d["QA"][i].analyses.length == 0) {
                    // console.error(d.Raw[i], "no prefix", d["QA"]);
                    word.push("ERROR: No Analyses", i);
                } else {
                    // console.log(d["QA"][i].analyses);
                    for (var k in d["QA"][i].analyses[0].prefix) {
                        word.push(d["QA"][i].analyses[0].prefix[k].utf8);
                    }
                    word.push(d["QA"][i].analyses[0].utf8);
                    for (var k in d["QA"][i].analyses[0].suffix) {
                        word.push(d["QA"][i].analyses[0].suffix[k].utf8);
                    }
                }
                oneWordData.word = word;
            } else
                oneWordData.word = d[whichRaw][i].split("+");

            for (var j in d) { // for each tool
                if (!oneWordData.tools[j]) // only process the taggers in the list
                    continue;

                // the case there is word not exist in tool
                if (!d[j][i]) {
                    var analysisData = {
                        error: true,
                        errMsg: "notExist",
                        ayahId: ayahId,
                        wid: i,
                        errCode: 3,
                        tid: j,
                        tool: j
                    };
                // the case the word has an error
                } else if (d[j][i].error) {
                    var analysisData = {
                        error: true,
                        errMsg: "WKNOWN WORD",
                        ayahId: ayahId,
                        utf8: d[j][i].utf8 || d[j][i].wutf8,
                        errCode: 4,
                        wid: i,
                        tid: j,
                        tool: j
                    };
                // the case we want the full info of the word
                } else if (feature == "orig")
                    var analysisData = {
                        value: d[j][i][feature],
                        ayahId: ayahId,
                        wid: i,
                        tid: j,
                        tool: j
                    };
                // the case the feature we request is in the word level; should not be like this. instead we should have it in analyses level
                else if (d[j][i][feature])
                    var analysisData = {
                        error: true,
                        errMsg: "feature of the word not an anlysis!",
                        value: d[j][i][feature],
                        errCode: 5,
                        utf8: d[j][i].utf8 || d[j][i].wutf8,
                        feature: feature,
                        ayahId: ayahId,
                        wid: i,
                        tid: j,
                    };
                // the proper way: the word has analyses, so we list them
                else if (d[j][i].analyses) {

                    // if the analyses are not sorted based on distance to input surface word.
                    // if (d[j][i].theMin == undefined) {
                    //     if (d[j][i].analyses && d[j][i].analyses.length == 1)
                    //         d[j][i].theMin = 0;
                    //     else {
                    //         for (var k in d[j][i].analyses) {
                    //             var a = d[j][i].analyses[k];
                    //             d[j][i].analyses[k].dist = Utils.getEditDistance(a.utf8, d[whichRaw][i]);
                    //         }
                    //         d[j][i].theMin = 0;
                    //         if (d[j][i].analyses && d[j][i].analyses.sort) {
                    //             d[j][i].analyses.sort(function(a, b) {
                    //                 if (a.dist > b.dist)
                    //                     return 1;
                    //                 else if (a.dist < b.dist)
                    //                     return -1;
                    //                 return 0;
                    //             });

                    //             for (var k in d[j][i].analyses) {
                    //                 if (d[j][i].analyses[k].dist == d[j][i].analyses[0].dist) {
                    //                     d[j][i].theMin = parseInt(k);
                    //                 }
                    //             }
                    //         } else {
                    //             console.error(d[j][i]);

                    //         }
                    //     }
                    // }
                    d[j][i].theMin = d[j][i].analyses.length
                    // the choosed analysis and correctness is the what is stored in cache
                    var counter = 0;
                    var ss = [$scope.sorah,ayahId,i, j].join("-")
                    if (d[j][i].choice == undefined) {
                        d[j][i].choice = chosedSolutions[ss] || undefined;
                    }
                    if (d[j][i].iscorrect == undefined) {
                        d[j][i].iscorrect = checkedSolutions[ss] || undefined;
                    }
                    // make the choosed analysis the first one if no other option is available
                    if (d[j][i].choice == undefined && d[j][i].theMin == 1)
                        d[j][i].choice = 0;

                    // Now what analyses info should be shown
                    if (feature == "morphemes" || $scope.whattask == "feature") {

                        if (d[j][i].choice == undefined)
                            analysisData = {
                                error: true,
                                ayahId: ayahId,
                                wid: i,
                                tid: j,
                                errCode: 1,
                                utf8: d[j][i].utf8,
                                errMsg: "NO CHOICE WAS MADE"
                            };
                        else if (d[j][i].analyses.length == 0) {
                            analysisData = {
                                error: true,
                                errMsg: "No Analyses",
                                errCode: 2,
                                obj: a,
                                utf8: a.utf8 || d[j][i].utf8,
                                mutf8: a.mutf8 || d[j][i].mutf8,
                                ayahId: ayahId,
                                wid: i,
                                tid: j,
                            };
                        }
                        else if (d[j][i].analyses.length >= 0) {
                            var a = d[j][i].analyses[d[j][i].choice];
                            if(!a){
                                console.log(j,i,d[j][i].choice,chosedSolutions[ss],d[j][i]);
                            }
                            analysisData = {
                                data: [],
                                ayahId: ayahId,
                                wid: i,
                                obj: a,
                                utf8: a.utf8 || d[j][i].utf8,
                                mutf8: a.mutf8 || d[j][i].mutf8,
                                tid: j,
                                iscorrect: d[j][i].iscorrect,
                                // morphemesSize: a.morphemes.length,
                            };
                            if(a.al_morphemes){// && feature == "morphemes"){
                                var counterr=0
                                for (var morph of a.al_morphemes) {
                                    if(!morph || !morph.map)
                                        console.log(feature,morph,i,j,a);
                                    var value = feature == "morphemes" || morph.pos=="-----"  || morph.pos=="E" ? morph.pos : (morph.map[feature] || morph[feature]);
                                    value = value || "--"
                                    analysisData.data.push({
                                        value: value,
                                        aid: counterr++,
                                        sim: morph.sim,
                                        obj: morph
                                    });
                                }
                                if(a.al_morphemes.length > al_morphemes_wordcount)
                                    al_morphemes_wordcount = a.al_morphemes.length
                            }
                            else{
                                for (var kk in a.morphemes) {
                                    if(!a.morphemes[kk])
                                        console.log(a.morphemes,i,j,a);
                                    var value = feature == "morphemes" || a.morphemes[kk].pos=="-----" ? a.morphemes[kk].pos : a.morphemes[kk].map[feature];
                                    value = value || "--"
                                    analysisData.data.push({
                                        value: value,
                                        aid: kk,
                                        sim: a.morphemes[kk].sim,
                                    });
                                }
                            }
                        }
                    } else {
                        var analysisData = {
                            data: [],
                            ayahId: ayahId,
                            wid: i,
                            tid: j,
                            utf8: d[j][i].utf8,
                            mutf8: d[j][i].mutf8,
                            choice: d[j][i].choice,
                            iscorrect: d[j][i].iscorrect,
                        };
                        for (var k in d[j][i].analyses) {
                            var a = d[j][i].analyses[k];
                            // getEditDistance(a.utf8, d["Raw"][i]);
                            if (["N/A", "na", "NA"].indexOf(a[feature]) >= 0) {
                                var value = "-"
                            } else if (feature == "pos") {
                                var value = []
                                for (var kk in a.morphemes)
                                    value.push(a.morphemes[kk].pos);
                                value = value.join(" ~ ")
                            } else if (feature == "disambig") {
                                var value = []
                                for (var kk in a.morphemes)
                                    value.push(a.morphemes[kk].pos);
                                value = value.join(" ~ ");
                                var sawalaha = []
                                for (var kk in a.morphemes){
                                    var ss =  a.morphemes[kk].sawalaha;
                                    sawalaha.push([ss[3],ss[7],ss[8],ss[9],ss[10],ss[11],ss[13],ss[15]].join(""));
                                }
                                sawalaha = sawalaha.join(" ~ ");
                            } else {
                                var value = a[feature] || "-"
                            }
                            analysisData.data.push({
                                aid: k,
                                obj: a,
                                value: value,
                                utf8: a.utf8 || d[j][i].utf8,
                                mutf8: a.mutf8 || d[j][i].mutf8,
                                sawalaha: sawalaha,
                                glossorlem: a.gloss || a.lemma,
                                theMin: k <= d[j][i].theMin,
                                choice: d[j][i].choice && k == d[j][i].choice,
                            });
                        }
                    }
                }
                oneWordData.tools[j] = analysisData;
            }

            /**** Show Predictions ****/
            if(d.predictions){
                console.log(oneWordData.tools[Object.keys(oneWordData.tools)[0]])
                var xxx = d.predictions.slice(al_morphemes_count,al_morphemes_count+a.al_morphemes.length)
                console.log("prediction",xxx)
                al_morphemes_count += a.al_morphemes.length
                oneWordData.predictions = xxx;
                $scope.is_prediction = true;
            }

            result.push(oneWordData);
            // }
        }
        // console.debug(result);
        return result;
    }

    $scope.onAnalysisClick = function(analysis, aword, e,sorah) {
        if (e.metaKey) {
            e.stopPropagation()
            e.preventDefault();

            if (e.metaKey && e.altKey) {
                allData[sorah+"-"+aword.ayahId][aword.tid][aword.wid].iscorrect = 1;
                checkedSolutions[sorah+"-"+aword.ayahId + "-" + aword.wid + "-" + aword.tid] = 1;
                analysis.iscorrect = 1;
                localStorage.checkedSolutions = JSON.stringify(checkedSolutions)
                console.log(sorah+"-"+aword.ayahId + "-" + aword.wid + "-" + aword.tid+"=1");
            } else if (e.metaKey) { // correct
                allData[sorah+"-"+aword.ayahId][aword.tid][aword.wid].iscorrect = 2;
                checkedSolutions[sorah+"-"+aword.ayahId + "-" + aword.wid + "-" + aword.tid] = 2;
                analysis.iscorrect = 2;
                localStorage.checkedSolutions = JSON.stringify(checkedSolutions)

                //also make it the choice
                allData[sorah+"-"+aword.ayahId][aword.tid][aword.wid].choice = analysis.aid;
                chosedSolutions[sorah+"-"+aword.ayahId + "-" + aword.wid + "-" + aword.tid] = analysis.aid;
                for (var i in aword.data)
                    aword.data[i].choice = false;
                aword.choice = analysis.aid;
                analysis.choice = true;
                localStorage.chosedSolutions = JSON.stringify(chosedSolutions)
            }
            return false;

        } else if (e.altKey) {
            e.stopPropagation()
            e.preventDefault();

            allData[sorah+"-"+aword.ayahId][aword.tid][aword.wid].choice = analysis.aid;
            chosedSolutions[sorah+"-"+aword.ayahId + "-" + aword.wid + "-" + aword.tid] = analysis.aid;
            for (var i in aword.data)
                aword.data[i].choice = false;
            aword.choice = analysis.aid;
            analysis.choice = true;

            localStorage.chosedSolutions = JSON.stringify(chosedSolutions)

            return false;
        } else {
            if ($("[aria-describedby]").get(0) != this) {
                $("[aria-describedby]").popover("hide");
                $(e.currentTarget).popover("show");
            } else {
                $(e.currentTarget).popover("hide");

            }
        }
    }
    $scope.overallSimilarityScore = {
        counter: 0,
        sum: 0,
    };

    var computeSimilarity = {
        global: function() {
            for (var wid in $scope.datas[$scope.ayah]) {
                //compute maximum morphemes
                var word = $scope.datas[$scope.ayah][wid];
                var max = 0;
                for (var tid in word.tools) {
                    if (!word.tools[tid].error && word.tools[tid].data.length > max)
                        max = word.tools[tid].data.length;
                }
                word.sim = {
                    counter: 0,
                    sum: 0,
                };
                for (var mid = 0; mid < max; mid++) {
                    for (tid1 in word.tools) {
                        var myscore = 0;
                        var counter = 0;
                        if (word.tools[tid1].error || !word.tools[tid1].data[mid])
                            continue;
                        var tag1 = tid1 + "#" + word.tools[tid1].data[mid].value;

                        for (tid2 in word.tools) {
                            if (tid1 == tid2)
                                continue;
                            if (word.tools[tid2].error)
                                continue;
                            if (!word.tools[tid2].data[mid]) {
                                continue;
                            }
                            var tag2 = tid2 + "#" + word.tools[tid2].data[mid].value;

                            if (tag1 == undefined || tag2 == undefined) {
                                console.error(tag1, tag2, mid)
                                continue;
                            }
                            if (word.tools[tid2].iscorrect == 1) {
                                continue;
                            }
                            if (word.tools[tid1].iscorrect == 1) {
                                continue;
                            }
                            var score = TagsSimiliarity(tag2, tag1);


                            counter++;

                            myscore += score;
                        }
                        word.tools[tid1].data[mid].sim = 0;
                        if (counter != 0) {
                            word.tools[tid1].data[mid].sim = myscore / counter;
                        }
                        $scope.overallSimilarityScore.sum += word.tools[tid1].data[mid].sim;
                        word.sim.sum += word.tools[tid1].data[mid].sim;
                        $scope.overallSimilarityScore.counter++;
                        word.sim.counter++;
                    }
                }
            }
        },
        fake: function() {
            return 0;
        },
        peerwise: function() {
            for (var wid in $scope.datas[$scope.ayah]) {
                var word = $scope.datas[$scope.ayah][wid];
                word.sim = {
                    counter: 0,
                    sum: 0,
                };
                for (tid1 in word.tools) {
                    for (var mid in word.tools[tid1].data) {
                        var myscore = 0;
                        if (word.tools[tid1].error || !word.tools[tid1].data[mid])
                            continue;
                        var tag1 = tid1 + "#" + word.tools[tid1].data[mid].value;

                        var tid2 = "SW";
                        if (tid1 == tid2){
                            continue;
                        }
                        if (word.tools[tid2].error)
                            continue;
                        if (!word.tools[tid2].data[mid]) {
                            continue;
                        }
                        var tag2 = tid2 + "#" + word.tools[tid2].data[mid].value;

                        if (tag1 == undefined || tag2 == undefined) {
                            console.error(tag1, tag2, mid)
                            continue;
                        }
                        if (word.tools[tid1].iscorrect == 1) {
                            continue;
                        }
                        var score = TagsSimiliarity(tag2, tag1);

                        if(score > 1){
                            console.warn("WHAT!")
                        }


                        myscore += score;

                        word.tools[tid1].data[mid].sim = myscore;

                        word.sim.sum += word.tools[tid1].data[mid].sim;
                        word.sim.counter++;
                        if(tid2!="SW"){
                            $scope.overallSimilarityScore.sum += word.tools[tid1].data[mid].sim;
                            $scope.overallSimilarityScore.counter++;
                        }
                    }
                }
            }
        }
    }
    // computeSimilarity.method = computeSimilarity.method;
    computeSimilarity.method = computeSimilarity.fake;

    $scope.getColor = function getColor(value) {
            //value from 0 to 1
            var hue = ((1 - value) * 120).toString(10);
            return ["hsl(", hue, ",100%,50%)"].join("");
        } //http://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage

    $scope.onGlobalKeyDown = function onKeyDown(e) {
        if ($(":input").is(":focus")) return;

        if (e.metaKey) {
            switch (e.which) {
                case 37: // left
                    e.preventDefault();
                    if (Pages.getPrev($scope.task))
                        $location.path("/analyse/" + Pages.getPrev($scope.task) + "/" + $scope.sorah + "/" + $scope.ayah+ "/" + $scope.alignp+ "/" + $scope.toolsp)
                    break;

                case 38: // up
                    e.preventDefault();
                    if (parseInt($scope.ayah) > 0)
                        $location.path("/analyse/" + $scope.task + "/" + $scope.sorah + "/" + (parseInt($scope.ayah) - 1) + "/" + $scope.alignp+ "/" + $scope.toolsp)
                    break;

                case 39: // right
                    e.preventDefault();
                    if (Pages.getNext($scope.task))
                        $location.path("/analyse/" + Pages.getNext($scope.task) + "/" + $scope.sorah + "/" + $scope.ayah+ "/" + $scope.alignp+ "/" + $scope.toolsp)
                    break;

                case 40: // down
                    e.preventDefault();
                    if (parseInt($scope.ayah) >= 0)
                        $location.path("/analyse/" + $scope.task + "/" + $scope.sorah + "/" + (parseInt($scope.ayah) + 1)+ "/" + $scope.alignp+ "/" + $scope.toolsp)
                    break;

                default:
                    return; // exit this handler for other keys
            }
        } else {
            switch (e.which) {
                case 37: // left
                    e.preventDefault();
                    if ($scope.selectedCell.tid > 0)
                        $scope.selectedCell.tid--;
                    break;

                case 39: // right
                    e.preventDefault();
                    if ($scope.selectedCell.tid < $scope.tableHeads.length - 1)
                        $scope.selectedCell.tid++;
                    break;

                case 38: // up
                    e.preventDefault();
                    if ($scope.selectedCell.aid == 0) {
                        if ($scope.selectedCell.wid > 0) {
                            $scope.selectedCell.wid--;
                            $scope.selectedCell.aid = 0;
                        }
                    } else {
                        $scope.selectedCell.aid--;
                    }
                    break;

                case 40: // down
                    e.preventDefault();
                    if (parseInt($scope.selectedCell.aid) < $scope.selectedCell.morphemes.length - 1) {
                        $scope.selectedCell.aid++;
                    } else {
                        if ($scope.selectedCell.wid < $scope.datas[$scope.ayah].length - 1) {
                            $scope.selectedCell.wid++;
                            $scope.selectedCell.aid = 0;
                        }
                    }
                    break;

                case 81: // q
                    e.preventDefault();
                    if ($scope.selectedCell.allData) {
                        console.log($scope.selectedCell.morphemes);
                        $scope.selectedCell.morphemes.splice($scope.selectedCell.aid, 0, {
                            pos: "-----",
                        });
                        $scope.datas[$scope.ayah] = transposeData($scope.task, allData, $scope.ayah, $scope.tableHeads);
                        computeSimilarity.method();
                    }
                    break;
                case 65: // a
                    e.preventDefault();
                    if ($scope.selectedCell.allData) {
                        // console.log($scope.selectedCell.allData);
                        $scope.selectedCell.morphemes.splice($scope.selectedCell.aid + 1, 0, {
                            pos: "-----",
                        });
                        $scope.datas[$scope.ayah] = transposeData($scope.task, allData, $scope.ayah, $scope.tableHeads);
                        computeSimilarity.method();
                    }
                    break;

                case 85: // u
                    e.preventDefault();
                    if ($scope.selectedCell.allData && $scope.undo) {
                        console.log($scope.undo);
                        $scope.undo.morphemes.splice($scope.undo.selectedCell.aid, 0, $scope.undo.obj);
                        $scope.datas[$scope.ayah] = transposeData($scope.task, allData, $scope.ayah, $scope.tableHeads);
                    }
                    break;

                case 191: // ?
                    $scope.showHelp = !$scope.showHelp;
                    break;

                case 67: // c
                    e.preventDefault();
                    // console.log($scope.selectedCell)
                    console.log($scope.datas[$scope.selectedCell.ayah][$scope.selectedCell.wid].tools[$scope.tableHeads[$scope.selectedCell.tid]].data[$scope.selectedCell.aid].sim)
                    // console.log($scope.selectedCell)
                    break;

                case 68: // d
                    e.preventDefault();
                    if ($scope.selectedCell.allData) {
                        $scope.undo = {
                            selectedCell: $scope.selectedCell,
                            obj: $scope.selectedCell.morphemes[$scope.selectedCell.aid],
                            morphemes: $scope.selectedCell.morphemes,
                        }
                        $scope.selectedCell.morphemes.splice($scope.selectedCell.aid, 1);
                        $scope.datas[$scope.ayah] = transposeData($scope.task, allData, $scope.ayah, $scope.tableHeads);
                        computeSimilarity.method();
                    }
                    break;

                case 32: // space
                    e.preventDefault();

                    var element = angular.element(".highlight");
                    element.tooltip("toggle");
                    break;

                case 88: // x
                    var x = allData[$scope.sorah+"-"+$scope.ayah][$scope.tableHeads[$scope.selectedCell.tid]][$scope.selectedCell.wid].iscorrect;
                    if (x == undefined || x == 0)
                        x = 1;
                    else
                        x = undefined;
                    allData[$scope.sorah+"-"+$scope.ayah][$scope.tableHeads[$scope.selectedCell.tid]][$scope.selectedCell.wid].iscorrect = x;

                    checkedSolutions[$scope.sorah+"-"+$scope.ayah + "-" + $scope.selectedCell.wid + "-" + $scope.tableHeads[$scope.selectedCell.tid]] = x;
                    // $scope.datas[$scope.ayah] = transposeData($scope.task, allData, $scope.ayah, $scope.tableHeads);
                    $scope.datas[$scope.ayah][$scope.selectedCell.wid].tools[$scope.tableHeads[$scope.selectedCell.tid]].iscorrect = x;
                    localStorage.checkedSolutions = JSON.stringify(checkedSolutions)
                    break;

                case 83: // s
                    computeSimilarity.method();
                    break;

                case 87: // w
                case 13: // enter
                    e.preventDefault();
                    var element = angular.element(".highlight");
                    element.popover({
                        placement:'auto'
                    }).popover("toggle");
                    break;

                case 73: // i
                    e.preventDefault();
                    
                    var d = allData[$scope.sorah+"-"+$scope.ayah];
                    var result = {}
                    for(var tool in d){
                        if(tool.length!=2)
                            continue;
                        result[tool] = {};
                        for(var wid in d[tool]){
                            if(d[tool][wid].error){
                                console.log("error",tool,wid);
                                continue;
                            }
                            var analysis = d[tool][wid].analyses[d[tool][wid].choice];
                            // console.log(d[tool][wid].choice);
                            // if(d[tool][wid].choice >= 0 ){
                            if(!analysis){
                                console.log("no analysis", tool,wid);
                                continue;
                            }
                                
                            // console.log(tool,wid);
                            var insertions = [];
                            for(var i in analysis.morphemes){
                                if(analysis.morphemes[i].pos == "-----"){
                                    if(!result[tool][wid])
                                        result[tool][wid] = {}
                                    insertions.push(parseInt(i))
                                }
                                if(result[tool][wid]){
                                    result[tool][wid].choice = d[tool][wid].choice;
                                    result[tool][wid].insertions = insertions;
                                }
                            // }
                            }
                            if(d[tool][wid].iscorrect == 1)
                                console.log(checkedSolutions[$scope.ayah + "-" + wid + "-" + tool]);
                        }
                    }
                    // console.log(result);
                    storedAlignment[$scope.sorah+"-"+$scope.ayah] = result;
                    localStorage.storedAlignment = JSON.stringify(storedAlignment);
                    break;

                default:
                    console.log(e.which);
                    return; // exit this handler for other keys
            }
            //for scrolling
            var element = angular.element(".highlight");
            if (element.length > 0) {
                element = element.get(0)
                var elementTop = element.getBoundingClientRect().top,
                    elementBottom = element.getBoundingClientRect().bottom;

                if (elementTop < 0 || elementBottom > window.innerHeight)
                    $timeout(window.scrollTo(0, element.offsetParent.offsetTop + element.offsetTop - 100), 100, false)
            }
            if($scope.selectedCell.ayah){
                $scope.selectedCell.allData = allData[$scope.selectedCell.sorah+"-"+$scope.selectedCell.ayah][$scope.tableHeads[$scope.selectedCell.tid]][$scope.selectedCell.wid];
                // $scope.selectedCell.allData = $scope.datas[$scope.selectedCell.ayah].tools[$scope.tableHeads[$scope.selectedCell.tid]].data[$scope.selectedCell.wid];
                if ($scope.selectedCell.allData && !$scope.selectedCell.allData.error && $scope.selectedCell.allData.analyses.length > 0 && $scope.selectedCell.allData.choice != undefined) {
                    $scope.selectedCell.morphemes = $scope.selectedCell.allData.analyses[$scope.selectedCell.allData.choice].morphemes;
                } else {
                    console.warn("No morphemes was found!");
                    $scope.selectedCell.morphemes = [];
                }
            }
        }
        $scope.$apply();
    }
    $scope.selectMorpheme = function(a, b, c) {
            $scope.selectedCell.wid = a;
            $scope.selectedCell.tid = $scope.tableHeads.indexOf(b);
            $scope.selectedCell.aid = c;
        }
        // console.debug(allData)
    $scope.datas = {};
    var counter = 0;
    $scope.ayat = [];
    for (var i in Data) {
        var ayahNumber = i.split("-")[1];
        if(!ayahNumber)
            continue;
        $scope.ayat.push(ayahNumber);
        if(!true && counter++ > 5)
            break;
    }
    var experi = ["9 8 26 46 30 52 50 43 23 62 39 64 33",
    "31 51 28 53 47 69 24 49 12 17 33 57",
    "21 59 56 28 2 30 54 52 27 26 66 5 15 36 34 62 1 58",
    "51 17 3 40 38 24 26 6 53 56 10 30",
    "53 64 59 29 57 35 51 54 7 39 25 20 52 66"]

    // experi = ["43 23 62 39 64 33",
    // "49 12 17 33 57",
    // "66 5 15 36 34 62 1 58",
    // "24 26 6 53 56 10 30",
    // "7 39 25 20 52 66"]

    // if(!$scope.ayah)
    //     $scope.ayat = experi[4].split(" ");

    for (var i in $scope.ayat) {
        $scope.datas[$scope.ayat[i]] = transposeData($scope.task, allData, $scope.ayat[i], $scope.tableHeads);
        // $scope.uploadAllResult(29,ayahNumber);
    }
    if ($scope.task == "morphemes")
        computeSimilarity.method();
    $(document).off("keydown").on("keydown", $scope.onGlobalKeyDown);

    if(!true){
        // for experiment
        var e = jQuery.Event("keydown");
        e.which = 77; // # m
        $timeout(function(){$(document).trigger(e)})
    }
    if(!true){
        // for experiment
        
        $timeout(function(){$("#saveCSV").trigger("click")})
    }
    if(!true){
        // for experiment
        
        $timeout(function(){$("#saveJSON").trigger("click")})
    }
});