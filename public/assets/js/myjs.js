var config = {
	serverName: "",
	ngram: 1,
	saveCSVonEachRoute: true,
}
;
var angapp = angular.module('sawaref', ["ngResource", "ngRoute", "angular.filter"]);

/** filters */
angapp.filter('object2Array', function() {
    return function(input) {
        var out = [];
        for (i in input) {
            if (typeof input[i] === 'object' && input[i]["$$state"] === undefined)
                out.push(input[i]);
        }
        return out;
    }
})
    .filter('to_trusted', ['$sce',
        function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
    }])
    .filter('concordance', function() {
        return function(input, word) {
            if (!input)
                return input;
            var words = input.split(/[\[\!\"\#\$\%\&\'\(\)\*\+\,\\\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~\] ،\u0640]/);
            for (var i in words) {
                if (word == words[i]) {
                    var windoww = 5;
                    var text = "";
                    for (var j = windoww; j >= -windoww; j--)
                        if (j == 0) {
                            text += "<span class='current_word'>" + words[i - j] + " </span>";
                        } else
                    if (words[i - j])
                        text += words[i - j] + " ";
                    return text;
                }
            }
            return input;
        };
    })
    .filter('slice', function() {
        return function(arr, start, end) {
            return (arr || []).slice(start, end);
        };
    })
    .filter('num', function() {
        return function(input) {
            return parseInt(input, 10);
        };
    })
    // .filter('sawa', function() {
    //     return function(i) {
    //         return [//i[0],i[1],i[2],i[3],i[4],i[5],
    //         i[3],i[7],i[8],i[9],i[10],i[11],i[13],i[15]].join("");
    //     };
    // })
    .filter('range', function() {
        return function(n) {
            var res = [];
            for (var i = 0; i < n; i++) {
                res.push(i);
            }
            return res;
        };
    });

angapp.factory('favortitesService', ['$rootScope',
    function($rootScope) {

        var service = {

            list: [],

            addToFavorites: function(favorite) {
                service.list.push(favorite);
                console.log("added", favorite);
            },

            saveFavorites: function() {
                localStorage.myfavorites = angular.toJson(service.list);
            },

            removeFromFavorties: function(mid) {
                // var newFav = [];
                for (var i in service.list) {
                    if (service.list[i].mid == mid) {
                        service.list.splice(i, 1);
                    }
                }
                // service.list = newFav;
                console.log(service.list)
            },

            restoreFavorties: function() {
                service.list = angular.fromJson(localStorage.myfavorites);
            }
        }

        // $rootScope.$on("addToFavorites", service.addToFavorites);
        $rootScope.$on("saveFavorites", service.saveFavorites);
        $rootScope.$on("restoreFavorties", service.restoreFavorties);

        return service;
}]);

angapp.run(function($rootScope) {
    window.onbeforeunload = function(event) {
        $rootScope.$broadcast('saveFavorites');
        sessionStorage.favsRestored = false;
    };
});


//     angular.forEach(members, function(member, index){
//    //Just add the index to your item
//    member.ind = index;
// });
angapp.directive('tooltip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            // $(element).tooltip({
            //     placement: 'right'function(context, source) {
            //         var position = $(source).position();

            //         if (position.left > 515) {
            //             return "left";
            //         }

            //         if (position.left < 515) {
            //             return "right";
            //         }

            //         if (position.top < 110) {
            //             return "bottom";
            //         }

            //         return "top";
            //     }
            // });
            $(element).hover(function() {
                // on mouseenter
                $(element).tooltip('show');
            }, function() {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
angapp.directive('popover', function() {
    return function(scope, elem) {
        elem.popover({
            placement: "left",
            // function(context, source) {
            //         var position = $(source).position();

            //         if (position.left > 515) {
            //             return "left";
            //         }

            //         if (position.left < 515) {
            //             return "right";
            //         }

            //         if (position.top < 110) {
            //             return "bottom";
            //         }

            //         return "top";
            //     },
            trigger: "manual",
        });
    }
});
angapp.directive('shaDeriTable', function() {
    return {
        templateUrl: 'sha-deri-table.html',
    };
});
angapp.directive('shaRightNav', function() {
    return {
        restrict: 'E',
        templateUrl: 'sha-right-nav.html',
        scope: {
            myType: '=myType'
        },
    };
});

// angapp.directive("definitiontool", function() {
//     return {
//         restrict: "A",
//         require: "ngModel",
//         link: function(scope, element, attrs, ngModel) {

//             ngModel.$render = function() {
//                 var tt =  [];
//                 if (ngModel.$viewValue) {
//                     tt= ngModel.$viewValue.toString().split(/\s+/g);
//                     for (var i in tt)
//                         tt[i] = "<div id='" + i + "' class='word word" + i%2 + "'>" + tt[i] + "</div>";
//                     console.log(tt);
//                 }
//                 element.html(tt.join("")|| "");
//             };

//             element.bind("blur keyup change", function() {
//                 scope.$apply(function() {
//                     ngModel.$setViewValue(element.text());
//                 });
//             });

//         }
//     };
// });

angapp.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
        }
    };
}); //http://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields


angapp.run(function ($rootScope,$timeout) {
    $rootScope.$on('$locationChangeSuccess', function () {
        if(config.saveCSVonEachRoute){
            // console.log("HERE");
            $timeout(function(){console.log("Application Loaded");})
            // $timeout(function(){$("#saveCSV").trigger("click")})
            // $("#saveCSV").trigger("click");
        }
    })
})
;
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
;
angapp.factory('TagsSimiliarity', function($http) {
    var data= {};
    var stats = {
        "first": 0,
        "second": 0,
        "noFirstTag": 0,
        "noSecondTag": 0,
        "total": 0,
    }
    // OLD AS IT IS NO LONGER TRIANGLE
    // var getSim =  function (tag1,tag2,debug) {
    //     if(!data[tag1]){
    //         if(!data[tag2]){
    //             // console.warn("no sim",tag1,tag2);
    //             return 0;
    //         }
    //         return data[tag2][tag1] || 0;
    //     }
    //     if(!data[tag1][tag2]){
    //         if(!data[tag2]){
    //             // console.warn("no sim",tag1,tag2);
    //             return 0;
    //         }
    //         return data[tag2][tag1] || 0;
    //     }
    //     return data[tag1][tag2];
    // };
    var getSim =  function (tag1,tag2,debug) {

        if(!data[tag1]){
            if(tag1.split("%").length == 1)
                stats.noFirstTag++;
            return 0;
        }
        if(!data[tag1][tag2]){
            if(tag1.split("%").length == 1)
                stats.noSecondTag++;
            return 0;
        }
        // console.log(data[tag1][tag2] , data[tag1].total[tag2.split("#")[0]].row);
        return 1.0 * data[tag1][tag2] / data[tag1].total[tag2.split("#")[0]].row;
        return data[tag1][tag2];
    };


    var url = 'assets/js/models.similarity.js';
    var promise = $http.get(url).then(function (response) {
        console.log(response.data.meta);
        data=response.data.data
      // return response.data;
    });
    return function(tag1,tag2,debug){
        if(debug==3){
            return stats;
        }
        // 2 gram + 1 gram
        // var val = getSim(tag1,tag2,debug) + getSim(tag1.replace(/%.*/,""),tag2.replace(/%.*/,""));

        // 1 gram
        var val = getSim(tag1.replace(/%.*/,""),tag2.replace(/%.*/,""));

        // if(val ==0){
        //     var val = getSim(tag1.replace(/%.*/,""),tag2.replace(/%.*/,""),debug);
        //     stats.first++;
        //     // console.log(tag1,tag2,val, "first");
        // }
        // else
        //     stats.second++;

        stats.total++;
        return  val;
    }
});
angapp.factory('Tools', function() {
    var keys = {
        MT: "ATKS Tagger from Microsoft™",
        MS: "ATKS Sarf from Microsoft™",
        KH: "AlKhalil Morphsyntactic Analyser v1.1",
        AR: "AraComLex",
        EX: "Elixir FM",
        MD: "MADA+TOKAN toolkit from Columbia University",
        MA: "MADAMIRA toolkit from Columbia University",
        MX: "MADAMIRA toolkit from Columbia University-XML",
        QA: "Quarnic Arabic Corpus",
        // Raw: "Raw",
        BP: "Buckwalter Morphological Analyser (Perl Version)",
        BJ: "Buckwalter Morphological Analyser (Java Version)",
        ST: "Stanford POS Tagger",
        SW: "SALMA Quarnic Corpus (Chapter 29)",
        MR: "MarMoT toolkit",
        WP: "SAPA ",
        AM: "Amira Toolkit",
        QT: "Qutuf Tollkit",
    };
    if(localStorage.toolslimit=="POS") 
        var list= [
        "MT",
        "MD",
        "MA",
        "MX",
        "ST",
        "MR",
        "WP",
        "AM",
        "FA",
        
        "QA",
        "SW",
    ];
    else if(localStorage.toolslimit=="MAN") 
        var list= [
        "KH",
        "AR",
        "EX",
        "AL",
        "BP",
        "BJ",
        "MS",
        "QT",

        "QA",
        "SW",
        ];
    else{
        var list = angular.fromJson(localStorage.toolslimit);
        if(!list || list.length == 0) 
            list= [
            "KH",
            "AR",
            "EX",
            "AL",
            "BP",
            "BJ",
            "MS",
            "QT",

            "MT",
            "MD",
            "MA",
            "MX",
            "ST",
            "MR",
            "WP",
            "AM",
            "FA",
            
            // "QA",
            // "SW",
        ];
    }
    var MAs = {
        MS: "ATKS Sarf",
        KH: "AlKhalil",
        AR: "AraComLex",
        AL: "ALMORGEANA",
        EX: "Elixir",
        BP: "buckwalter",
        BJ: "javaBW",
        QT: "Qutuf",
    }
    return {"keys":keys,"list":list,"MAs":MAs};
})


angapp.factory('AnalysisData', function() {
    var data = {};
    return list;
})

angapp.factory('checkedSolutions', function($http) {
    var checkedSolutions = {};
    $(window).on("unload",function() {
        localStorage.checkedSolutions = JSON.stringify(checkedSolutions);
    })
    try{
        var checkedSolutions = JSON.parse(localStorage.checkedSolutions);
    }
    catch(e){
        $http.get(config.serverName + "/backupData?id=checkedSolutions").then(function(d) {
            checkedSolutions = JSON.parse(d.result);
            localStorage.checkedSolutions = d.result;
        });
    }
    if (localStorage.checkedSolutions) {
        checkedSolutions = JSON.parse(localStorage.checkedSolutions)
    }

    return checkedSolutions;
})
angapp.factory('textsUUIDs', function() {
    var textsUUIDs = {};
    $(window).on("unload",function() {
        localStorage.textsUUIDs = JSON.stringify(textsUUIDs);
    })
    if (localStorage.textsUUIDs) {
        textsUUIDs = JSON.parse(localStorage.textsUUIDs);
    }
    return textsUUIDs;
})
angapp.factory('chosedSolutions', function($http) {
    var chosedSolutions = {};
    try{
        var chosedSolutions = JSON.parse(localStorage.chosedSolutions);
    }
    catch(e){
        $http.get(config.serverName + "/backupData?id=chosedSolutions").then(function(d) {
            chosedSolutions = JSON.parse(d.result);
            localStorage.chosedSolutions = d.result;
        });
    }
    if (localStorage.chosedSolutions) {
        chosedSolutions = JSON.parse(localStorage.chosedSolutions)
    }
    return chosedSolutions;
})
angapp.factory('QuranData', function() {
    return [[0, 7, 5, 1, 'الفاتحة', "Al-Fatiha", 'The Opening', 'Meccan'], [7, 286, 87, 40, 'البقرة', "Al-Baqara", 'The Heifer', 'Medinan'], [293, 200, 89, 20, 'آل عمران', "Al-i-Imran", 'The Family of Imran', 'Medinan'], [493, 176, 92, 24, 'النساء', "An-Nisa", 'The Women', 'Medinan'], [669, 120, 112, 16, 'المائدة', "Al-Ma'ida", 'The Table', 'Medinan'], [789, 165, 55, 20, 'الأنعام', "Al-An'am", 'The Cattle', 'Meccan'], [954, 206, 39, 24, 'الأعراف', "Al-A'raf", 'The Heights', 'Meccan'], [1160, 75, 88, 10, 'الأنفال', "Al-Anfal", 'The Spoils of War', 'Medinan'], [1235, 129, 113, 16, 'التوبة', "At-Tawba", 'The Repentance', 'Medinan'], [1364, 109, 51, 11, 'يونس', "Yunus", 'Jonah', 'Meccan'], [1473, 123, 52, 10, 'هود', "Hud", 'Hud', 'Meccan'], [1596, 111, 53, 12, 'يوسف', "Yusuf", 'Joseph', 'Meccan'], [1707, 43, 96, 6, 'الرعد', "Ar-Ra'd", 'The Thunder', 'Medinan'], [1750, 52, 72, 7, 'ابراهيم', "Ibrahim", 'Abraham', 'Meccan'], [1802, 99, 54, 6, 'الحجر', "Al-Hijr", 'The Stoneland', 'Meccan'], [1901, 128, 70, 16, 'النحل', "An-Nahl", 'The Honey Bees', 'Meccan'], [2029, 111, 50, 12, 'الإسراء', "Al-Isra", 'The Night Journey', 'Meccan'], [2140, 110, 69, 12, 'الكهف', "Al-Kahf", 'The Cave', 'Meccan'], [2250, 98, 44, 6, 'مريم', "Maryam", 'Mary', 'Meccan'], [2348, 135, 45, 8, 'طه', "Ta-Ha", 'Ta-Ha', 'Meccan'], [2483, 112, 73, 7, 'الأنبياء', "Al-Anbiya", 'The Prophets', 'Meccan'], [2595, 78, 103, 10, 'الحج', "Al-Hajj", 'The Pilgrimage', 'Medinan'], [2673, 118, 74, 6, 'المؤمنون', "Al-Mu'minun", 'The Believers', 'Meccan'], [2791, 64, 102, 9, 'النور', "An-Nur", 'The Light', 'Medinan'], [2855, 77, 42, 6, 'الفرقان', "Al-Furqan", 'The Criterion', 'Meccan'], [2932, 227, 47, 11, 'الشعراء', "Ash-Shu'ara", 'The Poets', 'Meccan'], [3159, 93, 48, 7, 'النمل', "An-Naml", 'The Ant', 'Meccan'], [3252, 88, 49, 9, 'القصص', "Al-Qasas", 'The Stories', 'Meccan'], [3340, 69, 85, 7, 'العنكبوت', "Al-Ankabut", 'The Spider', 'Meccan'], [3409, 60, 84, 6, 'الروم', "Ar-Rum", 'The Romans', 'Meccan'], [3469, 34, 57, 4, 'لقمان', "Luqman", 'Luqman', 'Meccan'], [3503, 30, 75, 3, 'السجدة', "As-Sajda", 'The Prostration', 'Meccan'], [3533, 73, 90, 9, 'الأحزاب', "Al-Ahzab", 'The Clans', 'Medinan'], [3606, 54, 58, 6, 'سبإ', "Saba", 'Sheba', 'Meccan'], [3660, 45, 43, 5, 'فاطر', "Fatir", 'The Originator', 'Meccan'], [3705, 83, 41, 5, 'يس', "Ya-Sin", 'Yaseen', 'Meccan'], [3788, 182, 56, 5, 'الصافات', "As-Saffat", 'Drawn up in Ranks', 'Meccan'], [3970, 88, 38, 5, 'ص', "Sad", 'The Letter Sad', 'Meccan'], [4058, 75, 59, 8, 'الزمر', "Az-Zumar", 'The Troops', 'Meccan'], [4133, 85, 60, 9, 'غافر', "Ghafir", 'The Forgiver', 'Meccan'], [4218, 54, 61, 6, 'فصلت', "Fussilat", 'Explained in Detail', 'Meccan'], [4272, 53, 62, 5, 'الشورى', "Ash-Shura", 'The Consultation', 'Meccan'], [4325, 89, 63, 7, 'الزخرف', "Az-Zukhruf", 'The Ornaments of Gold', 'Meccan'], [4414, 59, 64, 3, 'الدخان', "Ad-Dukhan", 'The Smoke', 'Meccan'], [4473, 37, 65, 4, 'الجاثية', "Al-Jathiya", 'Crouching', 'Meccan'], [4510, 35, 66, 4, 'الأحقاف', "Al-Ahqaf", 'The Dunes', 'Meccan'], [4545, 38, 95, 4, 'محمد', "Muhammad", 'Muhammad', 'Medinan'], [4583, 29, 111, 4, 'الفتح', "Al-Fath", 'The Victory', 'Medinan'], [4612, 18, 106, 2, 'الحجرات', "Al-Hujurat", 'The Inner Apartments', 'Medinan'], [4630, 45, 34, 3, 'ق', "Qaf", 'The Letter Qaf', 'Meccan'], [4675, 60, 67, 3, 'الذاريات', "Adh-Dhariyat", 'The Winnowing Winds', 'Meccan'], [4735, 49, 76, 2, 'الطور', "At-Tur", 'The Mount', 'Meccan'], [4784, 62, 23, 3, 'النجم', "An-Najm", 'The Star', 'Meccan'], [4846, 55, 37, 3, 'القمر', "Al-Qamar", 'The Moon', 'Meccan'], [4901, 78, 97, 3, 'الرحمن', "Ar-Rahman", 'The Beneficent', 'Medinan'], [4979, 96, 46, 3, 'الواقعة', "Al-Waqi'a", 'The Inevitable', 'Meccan'], [5075, 29, 94, 4, 'الحديد', "Al-Hadid", 'The Iron', 'Medinan'], [5104, 22, 105, 3, 'المجادلة', "Al-Mujadila", 'The Pleading', 'Medinan'], [5126, 24, 101, 3, 'الحشر', "Al-Hashr", 'The Exile', 'Medinan'], [5150, 13, 91, 2, 'الممتحنة', "Al-Mumtahina", 'Examining Her', 'Medinan'], [5163, 14, 109, 2, 'الصف', "As-Saff", 'The Ranks', 'Medinan'], [5177, 11, 110, 2, 'الجمعة', "Al-Jumu'a", 'Friday', 'Medinan'], [5188, 11, 104, 2, 'المنافقون', "Al-Munafiqun", 'The Hypocrites', 'Medinan'], [5199, 18, 108, 2, 'التغابن', "At-Taghabun", 'Mutual Disillusion', 'Medinan'], [5217, 12, 99, 2, 'الطلاق', "At-Talaq", 'Divorce', 'Medinan'], [5229, 12, 107, 2, 'التحريم', "At-Tahrim", 'The Prohibition', 'Medinan'], [5241, 30, 77, 2, 'الملك', "Al-Mulk", 'The Sovereignty', 'Meccan'], [5271, 52, 2, 2, 'القلم', "Al-Qalam", 'The Pen', 'Meccan'], [5323, 52, 78, 2, 'الحاقة', "Al-Haqqa", 'The Reality', 'Meccan'], [5375, 44, 79, 2, 'المعارج', "Al-Ma'arij", 'The Ascending Stairways', 'Meccan'], [5419, 28, 71, 2, 'نوح', "Nuh", 'Noah', 'Meccan'], [5447, 28, 40, 2, 'الجن', "Al-Jinn", 'The Jinn', 'Meccan'], [5475, 20, 3, 2, 'المزمل', "Al-Muzzammil", 'The Enshrouded One', 'Meccan'], [5495, 56, 4, 2, 'المدثر', "Al-Muddathir", 'The Cloaked One', 'Meccan'], [5551, 40, 31, 2, 'القيامة', "Al-Qiyama", 'The Resurrection', 'Meccan'], [5591, 31, 98, 2, 'الانسان', "Al-Insan", 'Human', 'Medinan'], [5622, 50, 33, 2, 'المرسلات', "Al-Mursalat", 'The Emissaries', 'Meccan'], [5672, 40, 80, 2, 'النبإ', "An-Naba'", 'The Announcement', 'Meccan'], [5712, 46, 81, 2, 'النازعات', "An-Nazi'at", 'Those Who Drag Forth', 'Meccan'], [5758, 42, 24, 1, 'عبس', "Abasa", 'He Frowned', 'Meccan'], [5800, 29, 7, 1, 'التكوير', "At-Takwir", 'The Folding Up', 'Meccan'], [5829, 19, 82, 1, 'الإنفطار', "Al-Infitar", 'The Cleaving', 'Meccan'], [5848, 36, 86, 1, 'المطففين', "Al-Mutaffifin", 'Defrauding', 'Meccan'], [5884, 25, 83, 1, 'الإنشقاق', "Al-Inshiqaq", 'The Splitting Open', 'Meccan'], [5909, 22, 27, 1, 'البروج', "Al-Buruj", 'The Constellations', 'Meccan'], [5931, 17, 36, 1, 'الطارق', "At-Tariq", 'The Morning Star', 'Meccan'], [5948, 19, 8, 1, 'الأعلى', "Al-A'la", 'The Most High', 'Meccan'], [5967, 26, 68, 1, 'الغاشية', "Al-Ghashiya", 'The Overwhelming', 'Meccan'], [5993, 30, 10, 1, 'الفجر', "Al-Fajr", 'The Dawn', 'Meccan'], [6023, 20, 35, 1, 'البلد', "Al-Balad", 'The City', 'Meccan'], [6043, 15, 26, 1, 'الشمس', "Ash-Shams", 'The Sun', 'Meccan'], [6058, 21, 9, 1, 'الليل', "Al-Lail", 'The Night', 'Meccan'], [6079, 11, 11, 1, 'الضحى', "Ad-Dhuha", 'The Morning Hours', 'Meccan'], [6090, 8, 12, 1, 'الشرح', "Ash-Sharh", 'The Consolation', 'Meccan'], [6098, 8, 28, 1, 'التين', "At-Tin", 'The Fig', 'Meccan'], [6106, 19, 1, 1, 'العلق', "Al-Alaq", 'The Clot', 'Meccan'], [6125, 5, 25, 1, 'القدر', "Al-Qadr", 'The Power, Fate', 'Meccan'], [6130, 8, 100, 1, 'البينة', "Al-Bayyina", 'The Evidence', 'Medinan'], [6138, 8, 93, 1, 'الزلزلة', "Az-Zalzala", 'The Earthquake', 'Medinan'], [6146, 11, 14, 1, 'العاديات', "Al-Adiyat", 'The Chargers', 'Meccan'], [6157, 11, 30, 1, 'القارعة', "Al-Qari'a", 'The Calamity', 'Meccan'], [6168, 8, 16, 1, 'التكاثر', "At-Takathur", 'Competition', 'Meccan'], [6176, 3, 13, 1, 'العصر', "Al-Asr", 'The Time', 'Meccan'], [6179, 9, 32, 1, 'الهمزة', "Al-Humaza", 'The Traducer', 'Meccan'], [6188, 5, 19, 1, 'الفيل', "Al-Fil", 'The Elephant', 'Meccan'], [6193, 4, 29, 1, 'قريش', "Quraysh", 'Quraysh', 'Meccan'], [6197, 7, 17, 1, 'الماعون', "Al-Ma'un", 'Almsgiving', 'Meccan'], [6204, 3, 15, 1, 'الكوثر', "Al-Kawthar", 'Abundance', 'Meccan'], [6207, 6, 18, 1, 'الكافرون', "Al-Kafirun", 'The Disbelievers', 'Meccan'], [6213, 3, 114, 1, 'النصر', "An-Nasr", 'Divine Support', 'Medinan'], [6216, 5, 6, 1, 'المسد', "Al-Masad", 'The Palm Fibre', 'Meccan'], [6221, 4, 22, 1, 'الإخلاص', "Al-Ikhlas", 'Purity of Faith', 'Meccan'], [6225, 5, 20, 1, 'الفلق', "Al-Falaq", 'The Dawn', 'Meccan'], [6230, 6, 21, 1, 'الناس', "An-Nas", 'Mankind', 'Meccan']];
});
angapp.factory('allData', function() {
    return {};
});
angapp.factory('Pages', function() {
    var data = {
        "pos":"POS",
        "stem":"Stem",
        "root":"Root",
        "lem":"Lemma",
        "prefix_pos":"Prefix",
        "suffix_pos":"Suffix",
        "gloss":"Gloss",
        "orig":"Original Raw Output",
        "morphemes":"Morphemes",
        "disambig":"Disambiguate",
        "utf8":"--Segment",
        "mood":"--Mood",
        "aspect":"--Aspect",
        "gender":"--Gender",
        "person":"--Person",
        "number":"--Number",
        "case":"--Case",
        "state":"--State",
        "voice":"--Voice",
    };
    return {
        getPrev: function(x) {
            var prev = null
            for (var i in data) {
                if (i == x) {
                    return prev;
                }
                prev = i;
            }
        },
        getNext: function(x) {
            var next = null
            for (var i in data) {
                if (next)
                    return i;
                if (i == x)
                    next = data[i];
            }

        },
        data: data,
    };
});

// });
angapp.factory('Utils', function($resource) {
    var funcs = {
        getEditDistance: function getEditDistance(a, b) {
            if (!a || a.length === 0) return b.length;
            if (!b || b.length === 0) return a.length;

            var matrix = [];

            // increment along the first column of each row
            var i;
            for (i = 0; i <= b.length; i++) {
                matrix[i] = [i];
            }

            // increment each column in the first row
            var j;
            for (j = 0; j <= a.length; j++) {
                matrix[0][j] = j;
            }

            // Fill in the rest of the matrix
            for (i = 1; i <= b.length; i++) {
                for (j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) == a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                            Math.min(matrix[i][j - 1] + 1, // insertion
                                matrix[i - 1][j] + 1)); // deletion
                    }
                }
            }

            return matrix[b.length][a.length];
        }, //http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance

    };
    return funcs;
});
// angapp.factory('Data', function($resource,$log,$rootScope) {
//     return $resource(config.serverName + "/analyzeAyah/", {
//         sorah: "@sorah",
//         ayah: "@ayah",
//     }, {
//         query: {
//             method: 'POST',
//             // cache: true,
//             transformResponse: function(data, header, status) {
//                 if(status != 200){
//                     $rootScope.$broadcast('myerrors',{error: "Server Error: "+status});
//                     return null;
//                 }
//                 var wrapped = angular.fromJson(data);
//                 console.log(wrapped);
//                 if (wrapped.ok == false) {
//                     console.error("Error in server side: " + wrapped.error)
//                     return {};
//                 }
//                 var storedAlignment = {};
//                 try{
//                     // var storedAlignment = {}
//                     var storedAlignment = JSON.parse(localStorage.storedAlignment);
//                 }
//                 catch(e){
//                 }

//                 // if(!wrapped.ayah){ // need to process all ayat
//                 //     // var arr = []
//                 //     // for(var i in wrapped.data){
//                 //     //     arr.push(i);
//                 //     // }
//                 //     // console.log(arr);

//                 // }
//                 // else{
//                 //     // var arr = [wrapped.sorah+"-"+wrapped.ayah]
//                 //     wrapped.data[wrapped.sorah+"-"+wrapped.ayah] = wrapped.data;
//                 // }
//                 for(var i in wrapped.data){
//                     var stored = storedAlignment[i];
//                     if(!stored){
//                         continue;
//                     }
//                     for(var tool in wrapped.data[i]){
//                         for(var wid in wrapped.data[i][tool]){
//                             if(!stored[tool] || !stored[tool][wid])
//                                 continue;
//                             var analysis = wrapped.data[i][tool][wid].analyses[stored[tool][wid].choice];
//                             var insertions = stored[tool][wid].insertions;
//                             var counter = 0;
//                             // if(!analysis){
//                             //     stored[tool][wid].choice=0
//                             //     analysis = wrapped.data[i][tool][wid].analyses[stored[tool][wid].choice];
//                             // }
//                             for(var j in insertions){
//                                 analysis.morphemes.splice(insertions[j]+counter, 0, {pos: "-----",})
//                                 counter++;
//                             }
//                         }
//                     }
//                 }
//                 // console.log(wrapped.data);
//                 return wrapped.data;
//             }
//         },
//     })
// });

angapp.factory('Data', function($resource,$log,$rootScope) {
    return $resource(config.serverName + "/analyzeAyah/", {
        sorah: "@sorah",
        ayah: "@ayah",
        align: "@align",
        tools: "@tools",
    }, {
        query: {
            method: 'POST',
            // cache: true,
            transformResponse: function(data, header, status) {
                if(status != 200){
                    $rootScope.$broadcast('myerrors',{error: "Server Error: "+status});
                    return null;
                }
                var wrapped = angular.fromJson(data);
                console.log(wrapped);
                if (wrapped.ok === false) {
                    console.error("Error in server side: " + wrapped.error)
                    return {};
                }
                // var storedAlignment = {};
                // try{
                //     // var storedAlignment = {}
                //     var storedAlignment = JSON.parse(localStorage.storedAlignment);
                // }
                // catch(e){
                // }

                // if(!wrapped.ayah){ // need to process all ayat
                //     // var arr = []
                //     // for(var i in wrapped.data){
                //     //     arr.push(i);
                //     // }
                //     // console.log(arr);

                // }
                // else{
                //     // var arr = [wrapped.sorah+"-"+wrapped.ayah]
                //     wrapped.data[wrapped.sorah+"-"+wrapped.ayah] = wrapped.data;
                // }
                // for(var i in wrapped.data){
                //     var stored = storedAlignment[i];
                //     if(!stored){
                //         continue;
                //     }
                //     for(var tool in wrapped.data[i]){
                //         for(var wid in wrapped.data[i][tool]){
                //             if(!stored[tool] || !stored[tool][wid])
                //                 continue;
                //             var analysis = wrapped.data[i][tool][wid].analyses[stored[tool][wid].choice];
                //             var insertions = stored[tool][wid].insertions;
                //             var counter = 0;
                //             // if(!analysis){
                //             //     stored[tool][wid].choice=0
                //             //     analysis = wrapped.data[i][tool][wid].analyses[stored[tool][wid].choice];
                //             // }
                //             for(var j in insertions){
                //                 analysis.morphemes.splice(insertions[j]+counter, 0, {pos: "-----",})
                //                 counter++;
                //             }
                //         }
                //     }
                // }
                // console.log(wrapped.data);
                return wrapped.data;
            }
        },
    })
});
;
angapp.factory('Translation', function($resource) {
    var x = {
        "MS": {},
        "KH": {},
        "SW": {
            'ng----': 'مصدر',
            'nm----': 'المصدر الميمي',
            'no----': 'مصدر المرَّة',
            'ns----': 'مصدر الهيئة/ مصدر النوع',
            'ne----': 'مصدر التوكيد',
            'ni----': 'المصدر الصناعي',
            'np----': 'ضمير',
            'nd----': 'اسم إشارة',
            'nr----': 'الاسم الموصول الخاص',
            'nc----': 'الاسم الموصول المشترك',
            'nb----': 'اسم استفهام',
            'nh----': 'اسم شرط',
            'na----': 'كناية',
            'nv----': 'ظرف',
            'nu----': 'اسم فاعل',
            'nw----': 'مبالغة اسم الفاعل',
            'nk----': 'اسم مفعول',
            'nj----': 'صفه مشبهة',
            'nl----': 'اسم مكان',
            'nt----': 'اسم زمان',
            'nz----': 'اسم آله',
            'nn----': 'اسم علم',
            'nq----': 'اسم جنس',
            'n+----': 'اسم عدد',
            'n&----': 'اسم فعل',
            'nf----': 'الأسماء الخمسة',
            'n*----': 'اسم منسوب',
            'ny----': 'اسم تصغير',
            'nx----': 'صيغة مبالغة',
            'n$----': 'اسم جمع',
            'n#----': 'اسم جنس جمعي',
            'n@----': 'اسم تفضيل',
            'n%----': 'اسم منحوت',
            'n!----': 'اسم صوت',
            'v-p---': 'فعل ماضٍ',
            'v-c---': 'فعل مضارع',
            'v-i---': 'فعل أمر',
            'p--j--': 'حرف جزم',
            'p--o--': 'حرف نصب',
            'p--p--': 'حرف جر',
            'p--a--': 'ناسخ',
            'p--c--': 'حرف عطف',
            'p--u--': 'حرف النصب الفرعي',
            'p--v--': 'حرف نداء',
            'p--x--': 'حرف استثناء',
            'p--i--': 'حرف استفهام',
            'p--f--': 'حرف استقبال',
            'p--s--': 'حرف تعليل',
            'p--n--': 'حرف نفي',
            'p--q--': 'حرف قسم',
            'p--w--': 'حرف الجواب',
            'p--k--': 'حرف شرط جازم',
            'p--m--': 'حرف تحضيض',
            'p--g--': 'حرف مصدري',
            'p--t--': 'حرف تنبيه',
            'p--z--': 'حرف توكيد',
            'p--d--': 'حرف تفسير',
            'p--l--': 'حرف تشبيه',
            'p--b--': 'حرف غير عامل',
            'r---p-': 'زيادة في أول الكلمة',
            'r---s-': 'زيادة في آخر الكلمة',
            'r---r-': 'ضمير متصل',
            'r---t-': 'تاء مربوطة',
            'r---y-': 'ياء النسبة',
            'r---k-': 'تنوين',
            'r---f-': 'تاء التأنيث',
            'r---n-': 'نون الوقاية',
            'r---z-': 'نون التوكيد',
            'r---a-': 'حرف مضارعة',
            'r---d-': 'أداة تعريف',
            'r---m-': 'حروف جمع المذكر السالم',
            'r---l-': 'حروف جمع المؤنث السالم',
            'r---u-': 'حروف المثنى',
            'r---I-': 'حروف الأمر',
            'r---g-': 'رقم',
            'r---c-': 'عملة',
            'r---e-': 'تاريخ',
            'r---w-': 'كلمة غير عربية',
            'r---x-': 'كلمة معربة',
            'u----s': 'نقطة (.)',
            'u----c': 'فاصلة (،)',
            'u----n': 'نقطتان (:)',
            'u----l': 'فاصلة منقوطة (؛)',
            'u----p': 'قوسان ( ( ) )',
            'u----b': 'قوسان حاصرتان ( [ ] )',
            'u----t': 'علامة اقتباس ( "" )',
            'u----d': 'شرطة معترضة ( - )',
            'u----q': 'علامة استفهام ( ؟ )',
            'u----e': 'علامة تعجب ( ! )',
            'u----i': 'علامة حذف (...)',
            'u----f': 'علامة التَّابعية (=)'
        },
        "QA": {

            "EXL ?": "explanation particle",
            "NUM": "Number",
            "DET (not listed in published paper)": "Determinator",
            "ADJ": "Adjective",
            "N": "Noun",
            "PN": "Proper Noun",
            "T": "time adverb",
            "PRON": "Personal Pronoun",
            "DEM": "Demonstrative pronoun",
            "T": "time adverb",
            "V": "verb",
            "REL": "relative pronoun",
            "IMPN": "imperative verbal noun",
            "LOC": "location adverb",
            "FUT": "future particle",
            "INTG": "interrogatove particle",
            "NEG": "negative particle",
            "RES": "restriction particle",
            "VOC": "vocative particle",
            "P": "preposition",
            "CONJ": "coordinating conjuntion",
            "SUB": "subordinating conjuntion",
            "LOC": "location adverb",
            "EMPH": "Emphativ lam prefix",
            "IMPV": "Imperative lam prefix",
            "PRP": "Purpose lam prefix",
            "ACC": "Accusative particle",
            "AMD": "Amendment particle",
            "ANS": "Answer particle",
            "AVR": "Aversion particle",
            "CAUS": "Particle of cause",
            "CERT": "حرف تحقيق-Particle of certainty",
            "CIRC": "حرف حال-Circumstantial particle",
            "COM": "واو المعية-Comitative particle",
            "COND": "حرف شرط-Conditional particle",
            "EQ": "حرف تسوية-Equalization particle",
            "EXH": "حرف تحضيض-Exhortation particle",
            "EXP": "أداة استثناء-Exceptive particle",
            "INC": "حرف ابتداء-Inceptive particle",
            "INT": "حرف تفسير-Particle of interpretation",
            "INTG": "حرف استفهام-Interogative particle",
            "PREV": "حرف كاف-Preventive particle",
            "PRO": "حرف نهي-Prohibition particle",
            "REM": "حرف استئنافية-Resumption particle",
            "RET": "حرف اضراب-Retraction particle",
            "RSLT": "حرف واقع في جواب الشرط-Result particle",
            "SUP": "حرف زائد-Supplemental particle",
            "SUR": "حرف فجاءة-Surprise particle",

        },
        "MD": {

            "adj_num": "Adjectives",
            "part_focus": "Particles",
            "adj_comp": "Adjectives",
            "latin": "Foreign/Latin",
            "part_det": "Particles",
            "adj": "Adjectives",
            "noun": "Nouns",
            "noun_prop": "Proper Nouns",
            "pron": "Pronouns",
            "pron_dem": "Pronouns",
            "punc": "Punctuation",
            "adv": "Adverbs",
            "part": "Particles",
            "interj": "Interjections",
            "verb_pseudo": "Verbs",
            "verb": "Verbs",
            "pron_exclam": "Pronouns",
            "noun_num": "Number Words",
            "noun_quant": "Number Words",
            "adv_interrog": "Adverbs",
            "adv_rel": "Adverbs",
            "pron_interrog": "Pronouns",
            "pron_rel": "Pronouns",
            "part_fut": "Particles",
            "part_interrog": "Particles",
            "part_neg": "Particles",
            "part_restrict": "Particles",
            "part_verb": "Particles",
            "part_voc": "Particles",
            "prep": "Prepositions",
            "abbrev": "Abbreviations",
            "conj": "Conjunctions",
            "conj_sub": "Conjunctions",
            "digi": "Digital Numbers",
        },
        "MA": {

            "abbrev": "اختصار",
            "adj": "صفة",
            "adj_comp": "اسم تفضيل",
            "adj_num": "صفة عددية",
            "adv": "حال",
            "adv_interrog": "حال",
            "adv_rel": "حال",
            "conj": "حرف عطف",
            "conj_sub": "حرف مصدري",
            "digit": "Digital Numbers",
            "interj": "Interjections",
            "latin": "حروف لاتينية",
            "noun": "اسم",
            "noun_num": "اسم عدد",
            "noun_prop": "اسم علم",
            "noun_quant": "اسم يدل على جزء",
            "part": "حرف",
            "part_dem": "Particles",
            "part_det": "حرف تعريف",
            "part_focus": "حرف تفصيل",
            "part_fut": "حرف استقبال",
            "part_interrog": "حرف استفهام",
            "part_neg": "حرف نفي",
            "part_restrict": "حرف استثناء",
            "part_verb": "حرف يدخل على الفعل الماضي",
            "part_voc": "حرف نداء",
            "prep": "حرف جر",
            "pron": "ضمير",
            "pron_dem": "اسم إشارة",
            "pron_exclam": "اسم تعجب",
            "pron_interrog": "اسم استفهام",
            "pron_rel": "اسم موصول",
            "punc": "علامة ترقيم",
            "verb": "فعل",
            "verb_pseudo": "حرف مشبه بالفعل",
        },
        "ST": {

            "ADJ_NUM": "?",
            "CC": "coordinating conj",
            "CD": "caridnal number",
            "DT": "determiniter / demonstrative pronoun",
            "IN": "preposition or subordinating conjunction",
            "JJ": "adjection",
            "JJR": "adjective, comparative",
            "NN": "singular common noun or abbr",
            "NNP": "singular proper noun",
            "NNPS": "dual or plural proper noun",
            "NNS": "plural or dual common noun or abbr",
            "NOUN_QUANT": "nominal quantifier",
            "PRP": "personal pronoun",
            "PRP$": "possessove personal pronoun",
            "PUNC": "punctuation",
            "RB": "adverb",
            "RP": "particle",
            "UH": "intergection",
            "VB": "imperative verb",
            "VBD": "active perfect verb",
            "VBG": "used here for verbal nouns/gerunds",
            "VBN": "passive imperfect/perfect verb",
            "VBP": "active imperfict verb",
            "VN": "used for verbal nominals/active or passive participles",
            "WP": "relative pronoun",
            "WRB": "wh- adverb (Intergo_adv and rel_adv)",
        },
        "AR": {

            "comp": "complementizer",
            "art": "Article",
            "adj": "Adjective",
            "noun": "Noun",
            "pron": "Pronoun",
            "adv": "Adverb",
            "part": "Particle",
            "verb": "Verb",
            "det": "determiner",
            "advprep": "Not mentioned in formal documentation",
            "prep": "Preposition",
            "conj": "Conjunction",
            "comp": "Complementizer",
            "det": "Determiner",
        },
        "EX": {
            "X-": "foreign word",
            "--": "isolated definite article",
            "A-": "adj",
            "N-": "noun",
            "Z-": "proper noun",
            "G-": "graphical symbol",
            "S-": "pronoun",
            "SD": "demonostrative pronoun",
            "PI": "mnSrf!!",
            "D-": "adv",
            "F-": "particle",
            "I-": "interjection",
            "VP": "perfect verb",
            "VI": "imperfect verb",
            "SP": "concatenated pronoun",
            "SR": "relative pronoun",
            "VC": "imperative verb",
            "FI": "interrogatove particle",
            "FN": "negative particle",
            "P-": "preposition",
            "Y-": "abbr",
            "C-": "conj",
            "Q-": "number",
        },
        "BJ": {

            "ADJ_PROP": "proper adjective",
            "FOCUS_PART": "focus particle",
            "ADJ_COMP": "comparitve adjective",
            "CONNEC_PART": "connective particle",
            "NOUN_QUANT": "quantifier noun",
            "LATIN": "latin script",
            "EMPHATIC_PART ": "emphatic particle",
            "ADJ": "adjective",
            "NOUN": "noun",
            "NOUN_PROP": "proper noun",
            "NOUN_NUM": "nominal/cardinal number",
            "TYPO": "typographical error ",
            "PRON": "pronoun",
            "PRON_{P}{G}{N}": "personal pronoun",
            "PUNC": "punctuation",
            "ADV": "adverb",
            "PART": "particle",
            "INTERJ": "interjection",
            "FOREIGN": "foreign word ",
            "PV_PASS ": "perfective passive verb",
            "PV": "perfective verb",
            "PSEUDO_VERB": "pseudo verb",
            "VERB": "verb",
            "POSS_PRON_{P}{G}{N}": "possessive personal pronoun",
            "ADJ_NUM": "adjectival/ordinal number",
            "ADJ.VN": "deverbal adjective",
            "REL_ADV": "relative adverb",
            "INTERROG_ADV": "interrogative adverb",
            "DEM_PRON_{G}{N}": "demonstrative pronoun",
            "REL_PRON": "relative pronoun",
            "INTERROG_PRON": "interrogative pronoun",
            "IV": "imperfective verb",
            "IV_PASS ": "imperfective passive verb",
            "CV": "imperative (command) verb",
            "FUT_PART": "future particle",
            "INTERROG_PART ": "interrogative particle",
            "JUS_PART ": "jussive particle  ",
            "NEG_PART ": "negative particle  ",
            "RC_PART ": "response conditional particle  ",
            "RESTRIC_PART ": "restrictive particle  ",
            "VERB_PART ": "verb particle  ",
            "VOC_PART": "vocative particle",
            "PREP": "preposition",
            "ABBREV": "abbreviation",
            "CONJ ": "conjunction ",
            "SUB_CONJ": "subordinating conjunction",
            "PARTIAL": "partial word ",
            "DIALECT": "dialectal word",
            "PVSUFF_DO:{P}{G}{N}": "direct object of perfective verb",
            "PVSUFF_SUBJ:{P}{G}{N}": "subject of perfective verb",
            "IVSUFF_DO:{P}{G}{N}": "imperfective verb direct object",
            "IV{P}{G}{N}": "imperfective verb prefix",
            "IVSUFF_SUBJ:{P}{G}{N}_MOOD:{Mood}": "imperfective verb subject and mood suffix",
            "CVSUFF_DO:{P}{G}{N}": "imperative verb object",
            "CVSUFF_SUBJ:{P}{G}{N}": "imperative verb subject",
            "VERB_IMPERATIVE": "Imperative verb",
            "VERB_IMPERFECT": "imperfective verb",
            "VERB_PERFECT": "Perfective verb",
            "PRON_1S": "Personal pronoun : 1st person singular",
            "PRON_2MS": "Personal pronoun : 2nd person masculine singular",
            "PRON_2FS": "Personal pronoun : 2nd person feminine singular",
            "PRON_3MS": "Personal pronoun : 3rd person masculine singular",
            "PRON_3FS": "Personal pronoun : 3rd person feminine singular",
            "PRON_2D": "Personal pronoun : 2nd person common dual",
            "PRON_3D": "Personal pronoun : 3rd person common dual",
            "PRON_1P": "Personal pronoun : 1st person plural",
            "PRON_2MP": "Personal pronoun : 2nd person masculine plural",
            "PRON_2FP": "Personal pronoun : 2nd person feminine plural",
            "PRON_3MP": "Personal pronoun : 3rd person masculine plural",
            "PRON_3FP": "Personal pronoun : 3rd person feminine plural",
            "DEM_PRON_F": "Feminine demonstrative pronoun",
            "DEM_PRON_FS": "Feminine singular demonstrative pronoun",
            "DEM_PRON_FS": "Feminine singular demonstrative pronoun",
            "DEM_PRON_FD": "Dual demonstrative pronoun",
            "DEM_PRON_MS": "Masculine singular demonstrative pronoun",
            "DEM_PRON_MD": "Masculine dual demonstrative pronoun",
            "DEM_PRON_MP": "Masculine plural demonstrative pronoun",
            "DET": "Determinative ?",
            "DEM_PRON_FS": "Feminine singular demonstrative pronoun",
            "ADJ": "Adjective",
            "NOUN": "Noun",
            "DEM_PRON_MP": "Masculine plural demonstrative pronoun",
            "NOUN_PROP": "Proper noun",
            "DEM_PRON_F": "Feminine demonstrative pronoun",
            "NUMERIC_COMMA": "Decimal separator",
            "PRON_1S": "Personal pronoun : 1st person singular",
            "PRON_2MS": "Personal pronoun : 2nd person masculine singular",
            "ADV": "Adverb",
            "PART": "Particle",
            "VERB_PERFECT": "Perfective verb",
            "VERB_IMPERFECT": "imperfective verb",
            "VERB_IMPERATIVE": "Imperative verb",
            "PRON_2FS": "Personal pronoun : 2nd person feminine singular",
            "DEM_PRON_FD": "Dual demonstrative pronoun",
            "DEM_PRON_MS": "Masculine singular demonstrative pronoun",
            "DEM_PRON_MD": "Masculine dual demonstrative pronoun",
            "REL_PRON": "Relative pronoun",
            "PRON_3MS": "Personal pronoun : 3rd person masculine singular",
            "PRON_3FS": "Personal pronoun : 3rd person feminine singular",
            "PRON_2D": "Personal pronoun : 2nd person common dual",
            "PRON_3D": "Personal pronoun : 3rd person common dual",
            "PRON_1P": "Personal pronoun : 1st person plural",
            "PRON_2MP": "Personal pronoun : 2nd person masculine plural",
            "PRON_2FP": "Personal pronoun : 2nd person feminine plural",
            "PRON_3MP": "Personal pronoun : 3rd person masculine plural",
            "PRON_3FP": "Personal pronoun : 3rd person feminine plural",
            "INTERROG": "",
            "ABBREV": "Abbreviation",
            "NO_RESULT": "",
            "NO_STEM": "No stem for the word",
        },
        "AM": {

            "CC": "coordinating conj",
            "CJP": "",
            "DET": "",
            "DT": "the, a, an",
            "FP": "",
            "IN": "preposition or subordinating conjunction",
            "JJ": "adjection",
            "JJCD": "cardinal adjection ",
            "JJR": "adjective, comparative",
            "NN": "singular common noun or abbr",
            "NNCD": "caridnal nount",
            "NNP": "singular proper noun",
            "NNS": "plural or dual common noun or abbr",
            "NQ": "",
            "PRP": "personal pronoun",
            "PUNC": "punctuation",
            "RB": "adverb",
            "RP": "particle",
            "VB": "imperative verb",
            "VBD": "active perfect verb",
            "VBG": "used here for verbal nouns/gerunds",
            "VBN": "passive imperfect/perfect verb",
            "VBP": "active imperfict verb",
            "VN": "used for verbal nominals/active or passive participles",
            "WP": "relative pronoun",
            "WRB": "wh- adverb (Intergo_adv and rel_adv)",

        },
    };
    x["AL"] = x["MA"];
    x["BP"] = x["BJ"];
    return x;
});
;
angapp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/analyse/pos'
        })
        .when('/analyse', {
            redirectTo: '/analyse/pos'
        })
        .when('/analyse/:task/:s?/', {
            templateUrl: 'generaltask.html',
            controller: 'AnalysisController',
            resolve: {
                Data: function(allData, Data, $route) {
                    return Data.query({"sorah":$route.current.params.s}).$promise;
                }
            }
        })
        .when('/analyse/:task/:s?/:a', {
            templateUrl: 'generaltask.html',
            controller: 'AnalysisController',
            resolve: {
                Data: function(allData, Data, $route) {
                    if (allData[$route.current.params.a])
                        return allData[$route.current.params.a];
                    return Data.query({"sorah":$route.current.params.s,"ayah":$route.current.params.a}).$promise;
                }
            }
        })
        .when('/analyse/:task/:s?/:a/:align/:tools', {
            templateUrl: 'generaltask.html',
            controller: 'AnalysisController',
            resolve: {
                Data: function(allData, Data, $route) {
                    // if (allData[$route.current.params.a])
                    //     return allData[$route.current.params.a];
                    return Data.query({
                        "sorah":$route.current.params.s,
                        "ayah":$route.current.params.a,
                        "align":$route.current.params.align,
                        "tools":$route.current.params.tools,
                    }).$promise;
                }
            }
        })
});