function init() {
    //array will be filled from the html
    // features = {};
    //tools

    //database of current loaded jsons
    // allData = {}



    //config
    ////////
    // serverName = ""; //http://abobander.com:5001/

    // Variables
    //variable to hold the recurrence method of checking status
    inter = null;

    // load localStorage
    ////////////////////
    // chosedSolutions = {};
    // checkedSolutions = {};
    // if (localStorage.chosedSolutions) {
    //     chosedSolutions = JSON.parse(localStorage.chosedSolutions)
    // }
    // if (localStorage.checkedSolutions) {
    //     checkedSolutions = JSON.parse(localStorage.checkedSolutions)
    // }
    // textsUUIDs = {};
    // window.onbeforeunload = function() {
    //     localStorage.textsUUIDs = JSON.stringify(textsUUIDs);
    // }
    // if (localStorage.textsUUIDs)
    //     textsUUIDs = JSON.parse(localStorage.textsUUIDs);
}
init();

// function setColumns(){
//     //columns of the table
//     columns = [];
//     columns.push({
//         field: "num",
//         title: "#",
//     }, {
//         field: "word",
//         title: "Word"
//     });
//     for (var j in list) {
//         if (j == "Raw")
//             continue;
//         columns.push({
//             field: j,
//             title: list[j],
//             sortable: true,
//         });
//     }
//     columns.push({
//         field: "feature",
//         title: "feature",
//         //visible : false,
//     });
// }
// function placementFunc(context, source) {
//     var position = $(source).position();

//     if (position.left > 515) {
//         return "left";
//     }

//     if (position.left < 515) {
//         return "right";
//     }

//     if (position.top < 110) {
//         return "bottom";
//     }

//     return "top";
// }

// function getParameterByName(name) {
//     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
//         results = regex.exec(location.search);
//     return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
// } //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

// function setTopSorahNavigator(ayahParam){

//     if (parseInt(ayahParam) > 0) {
//         var ayaCount = QuranData[getParameterByName('s') - 1][1];
//         var text = "";
//         for (var i = 1; i <= ayaCount; i++) {
//             if (i != ayahParam)
//                 text += "<li><a href='#" + getParameterByName('a') + "-" + i + "'>" + i + "</option>";
//             else
//                 text += "<li class='active'><a href='#" + getParameterByName('a') + "-" + i + "'>" + i + "</option>";
//         };
//         $("#ayahNo").html(text);
//         $("#ayahDisplay").text(ayahParam);

//     }
// }
$(function() {
    // var ayahParam = getParameterByName('a');

    // parse if arguments are provided
    // if (ayahParam && getParameterByName('s'))
    // parse(getParameterByName('s'), ayahParam);

    // stop submit the form
    // $("#sorahnameform").submit(function() {
    //     return false;
    // });

    // setTopSorahNavigator(ayahParam);



    // if feature is selected

    // $("#feature li a").each(function() {
    //     //features[$(this).attr("href").slice(1)] = $(this).text();
    // }).click(function() {
    //     // var $active = $(this);
    //     // $("#feature li").removeClass("active");
    //     // $active.parent().addClass("active");
    //     // var f = $active.attr("href").slice(1);

    //     // renderTable(f);
    // });


    // prepare auto complete for surah
    // var typeaheadData = [];
    // for (var i in QuranData)
    //     typeaheadData.push({
    //         id: i,
    //         name: (parseInt(i) + 1) + ": " + QuranData[i][5]
    //     });
    // $sorahNo = $("#sorahNo");
    // $sorahNo.typeahead({
    //     source: typeaheadData,
    // });

    // in case surah has changed
    // $sorahNo.change(function() {
    //     var current = $sorahNo.typeahead("getActive");
    //     if (!current) {
    //         // parse($("#sorahNo").val(), "");
    //         var arr = $("#sorahNo").val().split("-");
    //         window.location = "/?s=" + arr[0] + "&a=" + arr[1];
    //         return;
    //     }
    //     window.location = "/?s=" + (current.id - 0 + 1) + "&a=1";
    // });

    // when click a new ayah number
    // $("#ayahNo").on("click", "li a", function() {
    //     var value = $(this).text();
    //     window.location = "/?s=" + getParameterByName('s') + "&a=" + value + location.hash;
    // });


    // show all ayat, not efficient!
    // $("#showAll").on("click", function() {
    //     var sorahId = $("#sorahNo").val().split(":")[0];
    //     var ayaCount = QuranData[sorahId - 1][1];
    //     allData = {};
    //     var params = {
    //         sorah: sorahId,
    //     };
    //     var serial = 0;
    //     for (var i = 1; i <= ayaCount; i++) {
    //         params.ayah = i;
    //         $.post(serverName + "/analyzeAyah", params, function(data) {
    //             if (data) {
    //                 allData[data.ayah] = data.data;
    //             }
    //             serial++;
    //             if (serial == ayaCount) {
    //                 var all = [];
    //                 for (var i in allData)
    //                     all = all.concat(allData[i])
    //                 renderTable(all);
    //             }

    //         }, "json");
    //     }
    // });

    // $(document).keydown(onKeyDown);

});

// function onKeyDown(e) {
//     // if(event.which=="18")
//     //     cntrlIsPressed = true;
//     // if(event.which=="16")
//     //     shiftIsPressed = true;
//     // if(event.which=="91")
//     //     commandIsPressed = true;
//     // console.log(event.which);
//     if ($(":input").is(":focus")) return;

//     switch (e.which) {
//         case 37: // left
//             if ($("#feature li.active").prev("li").length) {
//                 //$("#feature li.active").removeClass("active").prev().addClass("active");
//                 $("#feature li.active").prev().children("a").trigger("click");
//             }

//             break;

//         case 38: // up
//             if ($("#ayahNo li.active").prev().length) {
//                 $("#ayahNo li.active").prev().children("a").trigger("click");
//             }
//             break;

//         case 39: // right
//             if ($("#feature li.active").next("li").length) {
//                 //$("#feature li.active").removeClass("active").next().addClass("active");
//                 $("#feature li.active").next().children("a").trigger("click");
//             }
//             break;

//         case 40: // down
//             if ($("#ayahNo li.active").next().length) {
//                 //$("#ayahNo").find("option:selected").next().attr("selected", true);
//                 $("#ayahNo li.active").next().children("a").trigger("click");
//             }
//             break;

//         default:
//             return; // exit this handler for other keys
//     }
//     e.preventDefault(); // prevent the default action (scroll / move caret)
// }




// function parse(sorahId, ayahId) {
//     var tmp = sorahId.split("-");
//     if (tmp.length > 1) {
//         sorahId = tmp[0];
//         ayahId = tmp[1];
//     }

//     var params = {
//         sorah: sorahId,
//         ayah: ayahId,
//     };
//     $.post(serverName + "/analyzeAyah", params, function(data) {
//         if (data) {
//             allData = {};
//             allData[data.ayah] = data.data;
//             console.log(data.data);
//             $("#feature li.active a").trigger("click");
//         } else {
//             console.error("bad reposonse");
//         }

//     }, "json");
// }

// var getStackTrace = function() {
//     var obj = {};
//     Error.captureStackTrace(obj, getStackTrace);
//     return obj.stack;
// };

// function renderTable(f,allData) {
//     var isHeader = false;

//     $table = $("#results");
//     var tableText = "";
//     for (var ayahId in allData) { // for every ayah
//         var d = allData[ayahId];

//         if (!isHeader) {
//             //start filling table
//             // $table.empty();
//             var text = ["<tr><th>num", "<th>word"];
//             for (var j in d) {
//                 if (!list[j])
//                     continue;
//                 text.push("<th>")
//                 text.push(j)
//             }
//             tableText += text.join("");
//             isHeader = true;
//         }

//         var whichRaw = !d["RawDia"] ? "Raw" : "RawDia";

//         for (var i in d.Raw) { // for every word
//             var dd = {};
//             var feature = f;
//             // dd.feature = feature;
//             dd.num = ayahId + "-" + i;

//             var word = "";
//             if (d.QA) {
//                 var counter = 0;
//                 if (!d["QA"][i]) {
//                     console.error(d.Raw[i], "no prefix", d["QA"]);
//                 } else {
//                     for (var k in d["QA"][i].analyses[0].prefix) {
//                         word += "<span class='theword " + (counter++ % 2 ? 'even' : 'odd') + "'>" + d["QA"][i].analyses[0].prefix[k].utf8 + "</span>";
//                     }
//                     word += "<span class='theword " + (counter++ % 2 ? 'even' : 'odd') + "'>" + d["QA"][i].analyses[0].utf8 + "</span>";
//                     for (var k in d["QA"][i].analyses[0].suffix) {
//                         word += "<span class='theword " + (counter++ % 2 ? 'even' : 'odd') + "'>" + d["QA"][i].analyses[0].suffix[k].utf8 + "</span>";
//                     }
//                 }
//                 dd.word = word;
//             } else if (d.RawDia) {
//                 dd.word = d.RawDia[i];
//             } else {
//                 dd.word = d.Raw[i];
//             }

//             for (var j in d) {
//                 if (!list[j]) // only process the taggers in the list
//                     continue;

//                 var p = d[j];
//                 text = "";

//                 // the case there is word not exist in tool
//                 if (!d[j][i]) {
//                     text += "<span class='" + j + " notExist'></span>";
//                 } else if (d[j][i].error) {
//                     text += "<span class='" + j + " error'>WKNOWN WORD</span>";
//                 } else if (d[j][i][feature])
//                     text += "<span class='" + j + " " + feature + "'>" + escapeHtml(d[j][i][feature]) + "</span>";
//                 else if (d[j][i].analyses) {
//                     var t = "";

//                     if (d[j][i].theMin == undefined) {
//                         if (d[j][i].analyses && d[j][i].analyses.length == 1)
//                             d[j][i].theMin = 0;
//                         else {
//                             for (var k in d[j][i].analyses) {
//                                 var a = d[j][i].analyses[k];
//                                 d[j][i].analyses[k].dist = getEditDistance(a.utf8, d[whichRaw][i]);
//                             }
//                             d[j][i].theMin = 0;
//                             if (d[j][i].analyses && d[j][i].analyses.sort) {
//                                 d[j][i].analyses.sort(function(a, b) {
//                                     if (a.dist > b.dist)
//                                         return 1;
//                                     else if (a.dist < b.dist)
//                                         return -1;
//                                     return 0;
//                                 });

//                                 for (var k in d[j][i].analyses) {
//                                     if (d[j][i].analyses[k].dist == d[j][i].analyses[0].dist)
//                                         d[j][i].theMin = parseInt(k);
//                                 }
//                             }
//                         }
//                     }
//                     var counter = 0;
//                     if (!d[j][i].choice) {
//                         d[j][i].choice = chosedSolutions[ayahId + "-" + i + "-" + j] || null;
//                     }
//                     if (!d[j][i].iscorrect) {
//                         d[j][i].iscorrect = checkedSolutions[ayahId + "-" + i + "-" + j] || null;
//                     }
//                     if (feature == "morphemes") {
//                         if (!d[j][i].choice && d[j][i].theMin > 1)
//                             t = "NO CHOICE WAS MADE"
//                         else if (d[j][i].analyses.length > 0) {
//                             var a = d[j][i].analyses[d[j][i].choice || d[j][i].theMin];
//                             for (var kk in a.morphemes) {
//                                 t += "<a role='button' tabindex='" + k + "'" + "class='" + (counter++ % 2 ? 'even ' : 'odd ') + " morph'>" //
//                                 + a.morphemes[kk].pos //
//                                 + "</a> "; //                        
//                             }
//                         }
//                     } else {
//                         for (var k in d[j][i].analyses) {
//                             var a = d[j][i].analyses[k];
//                             // getEditDistance(a.utf8, d["Raw"][i]);
//                             if (["N/A", "na", "NA"].indexOf(a[feature]) >= 0) {
//                                 var value = "-"
//                             } else if (feature == "pos") {
//                                 var value = []
//                                 for (var kk in a.morphemes)
//                                     value.push(a.morphemes[kk].pos);
//                                 value = value.join(" ~ ")
//                             } else if (!a[feature]) {
//                                 var value = "-"
//                             } else {
//                                 var value = escapeHtml(a[feature])
//                             }
//                             t += "<a role='button' tabindex='" + k + "'" + "id='" + ayahId + "-" + i + "-" + j + "-" + k + "'" + "class='" + ayahId + "-" + i + "-" + j + "-" + k + " " //this comment just to keep this line from formatting
//                             + (counter++ % 2 ? 'even ' : 'odd ') //
//                             + (d[j][i].choice && k != d[j][i].choice ? "notchosed " : "") + (d[j][i].iscorrect == 2 ? "correct " : d[j][i].iscorrect == 1 ? "incorrect " : "") + (k <= d[j][i].theMin ? "theMin " : "") //
//                             + j + " anal'>" //
//                             + value //
//                             + "</a> "; //
//                         }
//                     }
//                     text += "<span class='" + ayahId + "-" + j + " analyses'>" + t + "</span>";
//                 } else {
//                     text += "<span class='" + ayahId + "-" + j + " analyses'>-</span>";
//                 }
//                 dd[j] = text;
//             }
//             var text = ["<tr>"]
//             for (var col in dd) {
//                 text.push("<td>")
//                 text.push(dd[col])
//                 text.push("</td>")
//             }
//             tableText += text.join("");
//         }
//     }
//     $table.html(tableText);

//     //parseOld(f);
//     // $("#results").bootstrapTable("filterBy", {
//     //     "feature": f
//     // });
//     $("a.anal").click(function(e) {
//         if (e.metaKey) {
//             e.stopPropagation()
//             var arr = this.id.split("-")

//             if (e.metaKey && e.altKey) {
//                 allData[arr[0]][arr[2]][arr[1]].iscorrect = 1;
//                 checkedSolutions[arr[0] + "-" + arr[1] + "-" + arr[2]] = 1;
//                 $(this).addClass("incorrect").removeClass("correct");
//             } else if (e.metaKey) {
//                 allData[arr[0]][arr[2]][arr[1]].iscorrect = 2;
//                 checkedSolutions[arr[0] + "-" + arr[1] + "-" + arr[2]] = 2;
//                 $(this).addClass("correct").removeClass("incorrect");

//                 //also make it the choice
//                 allData[arr[0]][arr[2]][arr[1]].choice = arr[3];
//                 chosedSolutions[arr[0] + "-" + arr[1] + "-" + arr[2]] = arr[3]
//                 $("a.anal[class^='" + arr[0] + "-" + arr[1] + "-" + arr[2] + "-" + "']").addClass("notchosed");
//                 $(this).removeClass("notchosed");
//                 localStorage.chosedSolutions = JSON.stringify(chosedSolutions)
//             }

//             //console.log("a.anal[class^='" +arr[0]+"-"+arr[1]+"-"+arr[2]+"-"+ "']");

//             localStorage.checkedSolutions = JSON.stringify(checkedSolutions)

//             e.preventDefault();
//             return false;

//         } else if (e.altKey) {
//             e.stopPropagation()
//             var arr = this.id.split("-")

//             allData[arr[0]][arr[2]][arr[1]].choice = arr[3];
//             chosedSolutions[arr[0] + "-" + arr[1] + "-" + arr[2]] = arr[3]

//             //console.log("a.anal[class^='" +arr[0]+"-"+arr[1]+"-"+arr[2]+"-"+ "']");
//             $("a.anal[class^='" + arr[0] + "-" + arr[1] + "-" + arr[2] + "-" + "']").addClass("notchosed");
//             $(this).removeClass("notchosed");

//             localStorage.chosedSolutions = JSON.stringify(chosedSolutions)

//             e.preventDefault();
//             return false;
//         } else {
//             if ($("[aria-describedby]").get(0) != this) {
//                 $("[aria-describedby]").popover("hide");
//                 $(this).popover("show");
//             } else {
//                 $(this).popover("hide");

//             }
//         }
//     });
//     if (f != "orig") {
//         for (var ayahId in allData) { // for every word
//             var ddd = allData[ayahId];
//             // for (var i in d.Raw) { // for every word
//             for (var j in ddd) {
//                 for (var i in ddd[j]) {
//                     // if (ddd[j][i])
//                     if (!ddd[j][i][feature]) {
//                         for (var k in ddd[j][i].analyses) {
//                             $("." + ayahId + "-" + i + "-" + j + "-" + k).attr("data-content", JSON.stringify(d[j][i].analyses[k], null, 2)).popover({
//                                 placement: placementFunc,
//                                 trigger: "manual",
//                             });;
//                         }
//                     } else {
//                         $("." + ayahId + "-" + i + "-" + j).attr("data-content", JSON.stringify(d[j][i], null, 2)).popover({
//                             placement: placementFunc,
//                             trigger: "manual",
//                         });
//                     }
//                 }
//             }
//         }
//     } else {
//         $(".orig").each(function() {
//             $(this).attr("title", $(this).text());
//             $(this).text("Hover Here").tooltip({
//                 placement: "right"
//             });;
//         });
//     }

//     return {};
// }

// function downloadAllResult(link) {
//     var blob = new Blob([JSON.stringify(allData)], {
//         type: "text/json"
//     });
//     var URL = window.URL || window.webkitURL;
//     var downloadUrl = URL.createObjectURL(blob);
//     var a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = "download";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a)
// }
// var QuranData = [[0, 7, 5, 1, 'الفاتحة', "Al-Fatiha", 'The Opening', 'Meccan'], [7, 286, 87, 40, 'البقرة', "Al-Baqara", 'The Heifer', 'Medinan'], [293, 200, 89, 20, 'آل عمران', "Al-i-Imran", 'The Family of Imran', 'Medinan'], [493, 176, 92, 24, 'النساء', "An-Nisa", 'The Women', 'Medinan'], [669, 120, 112, 16, 'المائدة', "Al-Ma'ida", 'The Table', 'Medinan'], [789, 165, 55, 20, 'الأنعام', "Al-An'am", 'The Cattle', 'Meccan'], [954, 206, 39, 24, 'الأعراف', "Al-A'raf", 'The Heights', 'Meccan'], [1160, 75, 88, 10, 'الأنفال', "Al-Anfal", 'The Spoils of War', 'Medinan'], [1235, 129, 113, 16, 'التوبة', "At-Tawba", 'The Repentance', 'Medinan'], [1364, 109, 51, 11, 'يونس', "Yunus", 'Jonah', 'Meccan'], [1473, 123, 52, 10, 'هود', "Hud", 'Hud', 'Meccan'], [1596, 111, 53, 12, 'يوسف', "Yusuf", 'Joseph', 'Meccan'], [1707, 43, 96, 6, 'الرعد', "Ar-Ra'd", 'The Thunder', 'Medinan'], [1750, 52, 72, 7, 'ابراهيم', "Ibrahim", 'Abraham', 'Meccan'], [1802, 99, 54, 6, 'الحجر', "Al-Hijr", 'The Stoneland', 'Meccan'], [1901, 128, 70, 16, 'النحل', "An-Nahl", 'The Honey Bees', 'Meccan'], [2029, 111, 50, 12, 'الإسراء', "Al-Isra", 'The Night Journey', 'Meccan'], [2140, 110, 69, 12, 'الكهف', "Al-Kahf", 'The Cave', 'Meccan'], [2250, 98, 44, 6, 'مريم', "Maryam", 'Mary', 'Meccan'], [2348, 135, 45, 8, 'طه', "Ta-Ha", 'Ta-Ha', 'Meccan'], [2483, 112, 73, 7, 'الأنبياء', "Al-Anbiya", 'The Prophets', 'Meccan'], [2595, 78, 103, 10, 'الحج', "Al-Hajj", 'The Pilgrimage', 'Medinan'], [2673, 118, 74, 6, 'المؤمنون', "Al-Mu'minun", 'The Believers', 'Meccan'], [2791, 64, 102, 9, 'النور', "An-Nur", 'The Light', 'Medinan'], [2855, 77, 42, 6, 'الفرقان', "Al-Furqan", 'The Criterion', 'Meccan'], [2932, 227, 47, 11, 'الشعراء', "Ash-Shu'ara", 'The Poets', 'Meccan'], [3159, 93, 48, 7, 'النمل', "An-Naml", 'The Ant', 'Meccan'], [3252, 88, 49, 9, 'القصص', "Al-Qasas", 'The Stories', 'Meccan'], [3340, 69, 85, 7, 'العنكبوت', "Al-Ankabut", 'The Spider', 'Meccan'], [3409, 60, 84, 6, 'الروم', "Ar-Rum", 'The Romans', 'Meccan'], [3469, 34, 57, 4, 'لقمان', "Luqman", 'Luqman', 'Meccan'], [3503, 30, 75, 3, 'السجدة', "As-Sajda", 'The Prostration', 'Meccan'], [3533, 73, 90, 9, 'الأحزاب', "Al-Ahzab", 'The Clans', 'Medinan'], [3606, 54, 58, 6, 'سبإ', "Saba", 'Sheba', 'Meccan'], [3660, 45, 43, 5, 'فاطر', "Fatir", 'The Originator', 'Meccan'], [3705, 83, 41, 5, 'يس', "Ya-Sin", 'Yaseen', 'Meccan'], [3788, 182, 56, 5, 'الصافات', "As-Saffat", 'Drawn up in Ranks', 'Meccan'], [3970, 88, 38, 5, 'ص', "Sad", 'The Letter Sad', 'Meccan'], [4058, 75, 59, 8, 'الزمر', "Az-Zumar", 'The Troops', 'Meccan'], [4133, 85, 60, 9, 'غافر', "Ghafir", 'The Forgiver', 'Meccan'], [4218, 54, 61, 6, 'فصلت', "Fussilat", 'Explained in Detail', 'Meccan'], [4272, 53, 62, 5, 'الشورى', "Ash-Shura", 'The Consultation', 'Meccan'], [4325, 89, 63, 7, 'الزخرف', "Az-Zukhruf", 'The Ornaments of Gold', 'Meccan'], [4414, 59, 64, 3, 'الدخان', "Ad-Dukhan", 'The Smoke', 'Meccan'], [4473, 37, 65, 4, 'الجاثية', "Al-Jathiya", 'Crouching', 'Meccan'], [4510, 35, 66, 4, 'الأحقاف', "Al-Ahqaf", 'The Dunes', 'Meccan'], [4545, 38, 95, 4, 'محمد', "Muhammad", 'Muhammad', 'Medinan'], [4583, 29, 111, 4, 'الفتح', "Al-Fath", 'The Victory', 'Medinan'], [4612, 18, 106, 2, 'الحجرات', "Al-Hujurat", 'The Inner Apartments', 'Medinan'], [4630, 45, 34, 3, 'ق', "Qaf", 'The Letter Qaf', 'Meccan'], [4675, 60, 67, 3, 'الذاريات', "Adh-Dhariyat", 'The Winnowing Winds', 'Meccan'], [4735, 49, 76, 2, 'الطور', "At-Tur", 'The Mount', 'Meccan'], [4784, 62, 23, 3, 'النجم', "An-Najm", 'The Star', 'Meccan'], [4846, 55, 37, 3, 'القمر', "Al-Qamar", 'The Moon', 'Meccan'], [4901, 78, 97, 3, 'الرحمن', "Ar-Rahman", 'The Beneficent', 'Medinan'], [4979, 96, 46, 3, 'الواقعة', "Al-Waqi'a", 'The Inevitable', 'Meccan'], [5075, 29, 94, 4, 'الحديد', "Al-Hadid", 'The Iron', 'Medinan'], [5104, 22, 105, 3, 'المجادلة', "Al-Mujadila", 'The Pleading', 'Medinan'], [5126, 24, 101, 3, 'الحشر', "Al-Hashr", 'The Exile', 'Medinan'], [5150, 13, 91, 2, 'الممتحنة', "Al-Mumtahina", 'Examining Her', 'Medinan'], [5163, 14, 109, 2, 'الصف', "As-Saff", 'The Ranks', 'Medinan'], [5177, 11, 110, 2, 'الجمعة', "Al-Jumu'a", 'Friday', 'Medinan'], [5188, 11, 104, 2, 'المنافقون', "Al-Munafiqun", 'The Hypocrites', 'Medinan'], [5199, 18, 108, 2, 'التغابن', "At-Taghabun", 'Mutual Disillusion', 'Medinan'], [5217, 12, 99, 2, 'الطلاق', "At-Talaq", 'Divorce', 'Medinan'], [5229, 12, 107, 2, 'التحريم', "At-Tahrim", 'The Prohibition', 'Medinan'], [5241, 30, 77, 2, 'الملك', "Al-Mulk", 'The Sovereignty', 'Meccan'], [5271, 52, 2, 2, 'القلم', "Al-Qalam", 'The Pen', 'Meccan'], [5323, 52, 78, 2, 'الحاقة', "Al-Haqqa", 'The Reality', 'Meccan'], [5375, 44, 79, 2, 'المعارج', "Al-Ma'arij", 'The Ascending Stairways', 'Meccan'], [5419, 28, 71, 2, 'نوح', "Nuh", 'Noah', 'Meccan'], [5447, 28, 40, 2, 'الجن', "Al-Jinn", 'The Jinn', 'Meccan'], [5475, 20, 3, 2, 'المزمل', "Al-Muzzammil", 'The Enshrouded One', 'Meccan'], [5495, 56, 4, 2, 'المدثر', "Al-Muddathir", 'The Cloaked One', 'Meccan'], [5551, 40, 31, 2, 'القيامة', "Al-Qiyama", 'The Resurrection', 'Meccan'], [5591, 31, 98, 2, 'الانسان', "Al-Insan", 'Human', 'Medinan'], [5622, 50, 33, 2, 'المرسلات', "Al-Mursalat", 'The Emissaries', 'Meccan'], [5672, 40, 80, 2, 'النبإ', "An-Naba'", 'The Announcement', 'Meccan'], [5712, 46, 81, 2, 'النازعات', "An-Nazi'at", 'Those Who Drag Forth', 'Meccan'], [5758, 42, 24, 1, 'عبس', "Abasa", 'He Frowned', 'Meccan'], [5800, 29, 7, 1, 'التكوير', "At-Takwir", 'The Folding Up', 'Meccan'], [5829, 19, 82, 1, 'الإنفطار', "Al-Infitar", 'The Cleaving', 'Meccan'], [5848, 36, 86, 1, 'المطففين', "Al-Mutaffifin", 'Defrauding', 'Meccan'], [5884, 25, 83, 1, 'الإنشقاق', "Al-Inshiqaq", 'The Splitting Open', 'Meccan'], [5909, 22, 27, 1, 'البروج', "Al-Buruj", 'The Constellations', 'Meccan'], [5931, 17, 36, 1, 'الطارق', "At-Tariq", 'The Morning Star', 'Meccan'], [5948, 19, 8, 1, 'الأعلى', "Al-A'la", 'The Most High', 'Meccan'], [5967, 26, 68, 1, 'الغاشية', "Al-Ghashiya", 'The Overwhelming', 'Meccan'], [5993, 30, 10, 1, 'الفجر', "Al-Fajr", 'The Dawn', 'Meccan'], [6023, 20, 35, 1, 'البلد', "Al-Balad", 'The City', 'Meccan'], [6043, 15, 26, 1, 'الشمس', "Ash-Shams", 'The Sun', 'Meccan'], [6058, 21, 9, 1, 'الليل', "Al-Lail", 'The Night', 'Meccan'], [6079, 11, 11, 1, 'الضحى', "Ad-Dhuha", 'The Morning Hours', 'Meccan'], [6090, 8, 12, 1, 'الشرح', "Ash-Sharh", 'The Consolation', 'Meccan'], [6098, 8, 28, 1, 'التين', "At-Tin", 'The Fig', 'Meccan'], [6106, 19, 1, 1, 'العلق', "Al-Alaq", 'The Clot', 'Meccan'], [6125, 5, 25, 1, 'القدر', "Al-Qadr", 'The Power, Fate', 'Meccan'], [6130, 8, 100, 1, 'البينة', "Al-Bayyina", 'The Evidence', 'Medinan'], [6138, 8, 93, 1, 'الزلزلة', "Az-Zalzala", 'The Earthquake', 'Medinan'], [6146, 11, 14, 1, 'العاديات', "Al-Adiyat", 'The Chargers', 'Meccan'], [6157, 11, 30, 1, 'القارعة', "Al-Qari'a", 'The Calamity', 'Meccan'], [6168, 8, 16, 1, 'التكاثر', "At-Takathur", 'Competition', 'Meccan'], [6176, 3, 13, 1, 'العصر', "Al-Asr", 'The Time', 'Meccan'], [6179, 9, 32, 1, 'الهمزة', "Al-Humaza", 'The Traducer', 'Meccan'], [6188, 5, 19, 1, 'الفيل', "Al-Fil", 'The Elephant', 'Meccan'], [6193, 4, 29, 1, 'قريش', "Quraysh", 'Quraysh', 'Meccan'], [6197, 7, 17, 1, 'الماعون', "Al-Ma'un", 'Almsgiving', 'Meccan'], [6204, 3, 15, 1, 'الكوثر', "Al-Kawthar", 'Abundance', 'Meccan'], [6207, 6, 18, 1, 'الكافرون', "Al-Kafirun", 'The Disbelievers', 'Meccan'], [6213, 3, 114, 1, 'النصر', "An-Nasr", 'Divine Support', 'Medinan'], [6216, 5, 6, 1, 'المسد', "Al-Masad", 'The Palm Fibre', 'Meccan'], [6221, 4, 22, 1, 'الإخلاص', "Al-Ikhlas", 'Purity of Faith', 'Meccan'], [6225, 5, 20, 1, 'الفلق', "Al-Falaq", 'The Dawn', 'Meccan'], [6230, 6, 21, 1, 'الناس', "An-Nas", 'Mankind', 'Meccan']];

// for (var i in QuranData) {
//     $("#sorahNo").append('<li><a href="#' + i + '">' + QuranData[i][5] + '</a></li>')
// }
// Compute the edit distance between the two given strings
// function getEditDistance(a, b) {
//     if (!a || a.length === 0) return b.length;
//     if (!b || b.length === 0) return a.length;

//     var matrix = [];

//     // increment along the first column of each row
//     var i;
//     for (i = 0; i <= b.length; i++) {
//         matrix[i] = [i];
//     }

//     // increment each column in the first row
//     var j;
//     for (j = 0; j <= a.length; j++) {
//         matrix[0][j] = j;
//     }

//     // Fill in the rest of the matrix
//     for (i = 1; i <= b.length; i++) {
//         for (j = 1; j <= a.length; j++) {
//             if (b.charAt(i - 1) == a.charAt(j - 1)) {
//                 matrix[i][j] = matrix[i - 1][j - 1];
//             } else {
//                 matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
//                     Math.min(matrix[i][j - 1] + 1, // insertion
//                         matrix[i - 1][j] + 1)); // deletion
//             }
//         }
//     }

//     return matrix[b.length][a.length];
// } //http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance

// function escapeHtml(unsafe) {
//     if (typeof unsafe === "object")
//         unsafe = JSON.stringify(unsafe);
//     if (typeof unsafe === "string")
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
// } //http://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript



// var renderTable2 = function(f, allData) {
//     var whichRaw = !d["RawDia"] ? "Raw" : "RawDia";
//     // $table = $("#results");
//     // var tableText = "";

//     for (var ayahId in allData) { // for every ayah
//         var d = allData[ayahId];

//         for (var i in d.Raw) { // for every word
//             var dd = {};
//             var feature = f;
//             // dd.feature = feature;
//             dd.num = ayahId + "-" + i;

//             var word = "";
//             if (d.QA) {
//                 var counter = 0;
//                 if (!d["QA"][i]) {
//                     console.error(d.Raw[i], "no prefix", d["QA"]);
//                 } else {
//                     for (var k in d["QA"][i].analyses[0].prefix) {
//                         word += "<span class='theword " + (counter++ % 2 ? 'even' : 'odd') + "'>" + d["QA"][i].analyses[0].prefix[k].utf8 + "</span>";
//                     }
//                     word += "<span class='theword " + (counter++ % 2 ? 'even' : 'odd') + "'>" + d["QA"][i].analyses[0].utf8 + "</span>";
//                     for (var k in d["QA"][i].analyses[0].suffix) {
//                         word += "<span class='theword " + (counter++ % 2 ? 'even' : 'odd') + "'>" + d["QA"][i].analyses[0].suffix[k].utf8 + "</span>";
//                     }
//                 }
//                 dd.word = word;
//             } else if (d.RawDia) {
//                 dd.word = d.RawDia[i];
//             } else {
//                 dd.word = d.Raw[i];
//             }

//             for (var j in d) {
//                 if (!list[j]) // only process the taggers in the list
//                     continue;

//                 var p = d[j];
//                 text = "";

//                 // the case there is word not exist in tool
//                 if (!d[j][i]) {
//                     text += "<span class='" + j + " notExist'></span>";
//                 } else if (d[j][i].error) {
//                     text += "<span class='" + j + " error'>WKNOWN WORD</span>";
//                 } else if (d[j][i][feature])
//                     text += "<span class='" + j + " " + feature + "'>" + escapeHtml(d[j][i][feature]) + "</span>";
//                 else if (d[j][i].analyses) {
//                     var t = "";

//                     if (d[j][i].theMin == undefined) {
//                         if (d[j][i].analyses && d[j][i].analyses.length == 1)
//                             d[j][i].theMin = 0;
//                         else {
//                             for (var k in d[j][i].analyses) {
//                                 var a = d[j][i].analyses[k];
//                                 d[j][i].analyses[k].dist = getEditDistance(a.utf8, d[whichRaw][i]);
//                             }
//                             d[j][i].theMin = 0;
//                             if (d[j][i].analyses && d[j][i].analyses.sort) {
//                                 d[j][i].analyses.sort(function(a, b) {
//                                     if (a.dist > b.dist)
//                                         return 1;
//                                     else if (a.dist < b.dist)
//                                         return -1;
//                                     return 0;
//                                 });

//                                 for (var k in d[j][i].analyses) {
//                                     if (d[j][i].analyses[k].dist == d[j][i].analyses[0].dist)
//                                         d[j][i].theMin = parseInt(k);
//                                 }
//                             }
//                         }
//                     }
//                     var counter = 0;
//                     if (!d[j][i].choice) {
//                         d[j][i].choice = chosedSolutions[ayahId + "-" + i + "-" + j] || null;
//                     }
//                     if (!d[j][i].iscorrect) {
//                         d[j][i].iscorrect = checkedSolutions[ayahId + "-" + i + "-" + j] || null;
//                     }
//                     if (feature == "morphemes") {
//                         if (!d[j][i].choice && d[j][i].theMin > 1)
//                             t = "NO CHOICE WAS MADE"
//                         else if (d[j][i].analyses.length > 0) {
//                             var a = d[j][i].analyses[d[j][i].choice || d[j][i].theMin];
//                             for (var kk in a.morphemes) {
//                                 t += "<a role='button' tabindex='" + k + "'" + "class='" + (counter++ % 2 ? 'even ' : 'odd ') + " morph'>" //
//                                 + a.morphemes[kk].pos //
//                                 + "</a> "; //                        
//                             }
//                         }
//                     } else {
//                         for (var k in d[j][i].analyses) {
//                             var a = d[j][i].analyses[k];
//                             // getEditDistance(a.utf8, d["Raw"][i]);
//                             if (["N/A", "na", "NA"].indexOf(a[feature]) >= 0) {
//                                 var value = "-"
//                             } else if (feature == "pos") {
//                                 var value = []
//                                 for (var kk in a.morphemes)
//                                     value.push(a.morphemes[kk].pos);
//                                 value = value.join(" ~ ")
//                             } else if (!a[feature]) {
//                                 var value = "-"
//                             } else {
//                                 var value = escapeHtml(a[feature])
//                             }
//                             t += "<a role='button' tabindex='" + k + "'" + "id='" + ayahId + "-" + i + "-" + j + "-" + k + "'" + "class='" + ayahId + "-" + i + "-" + j + "-" + k + " " //this comment just to keep this line from formatting
//                             + (counter++ % 2 ? 'even ' : 'odd ') //
//                             + (d[j][i].choice && k != d[j][i].choice ? "notchosed " : "") + (d[j][i].iscorrect == 2 ? "correct " : d[j][i].iscorrect == 1 ? "incorrect " : "") + (k <= d[j][i].theMin ? "theMin " : "") //
//                             + j + " anal'>" //
//                             + value //
//                             + "</a> "; //
//                         }
//                     }
//                     text += "<span class='" + ayahId + "-" + j + " analyses'>" + t + "</span>";
//                 } else {
//                     text += "<span class='" + ayahId + "-" + j + " analyses'>-</span>";
//                 }
//                 dd[j] = text;
//             }
//             var text = ["<tr>"]
//             for (var col in dd) {
//                 text.push("<td>")
//                 text.push(dd[col])
//                 text.push("</td>")
//             }
//             tableText += text.join("");
//         }
//     }
//     //$table.html(tableText);

//     //parseOld(f);
//     // $("#results").bootstrapTable("filterBy", {
//     //     "feature": f
//     // });
//     $("a.anal").click(function(e) {
//         if (e.metaKey) {
//             e.stopPropagation()
//             var arr = this.id.split("-")

//             if (e.metaKey && e.altKey) {
//                 allData[arr[0]][arr[2]][arr[1]].iscorrect = 1;
//                 checkedSolutions[arr[0] + "-" + arr[1] + "-" + arr[2]] = 1;
//                 $(this).addClass("incorrect").removeClass("correct");
//             } else if (e.metaKey) {
//                 allData[arr[0]][arr[2]][arr[1]].iscorrect = 2;
//                 checkedSolutions[arr[0] + "-" + arr[1] + "-" + arr[2]] = 2;
//                 $(this).addClass("correct").removeClass("incorrect");

//                 //also make it the choice
//                 allData[arr[0]][arr[2]][arr[1]].choice = arr[3];
//                 chosedSolutions[arr[0] + "-" + arr[1] + "-" + arr[2]] = arr[3]
//                 $("a.anal[class^='" + arr[0] + "-" + arr[1] + "-" + arr[2] + "-" + "']").addClass("notchosed");
//                 $(this).removeClass("notchosed");
//                 localStorage.chosedSolutions = JSON.stringify(chosedSolutions)
//             }

//             //console.log("a.anal[class^='" +arr[0]+"-"+arr[1]+"-"+arr[2]+"-"+ "']");

//             localStorage.checkedSolutions = JSON.stringify(checkedSolutions)

//             e.preventDefault();
//             return false;

//         } else if (e.altKey) {
//             e.stopPropagation()
//             var arr = this.id.split("-")

//             allData[arr[0]][arr[2]][arr[1]].choice = arr[3];
//             chosedSolutions[arr[0] + "-" + arr[1] + "-" + arr[2]] = arr[3]

//             //console.log("a.anal[class^='" +arr[0]+"-"+arr[1]+"-"+arr[2]+"-"+ "']");
//             $("a.anal[class^='" + arr[0] + "-" + arr[1] + "-" + arr[2] + "-" + "']").addClass("notchosed");
//             $(this).removeClass("notchosed");

//             localStorage.chosedSolutions = JSON.stringify(chosedSolutions)

//             e.preventDefault();
//             return false;
//         } else {
//             if ($("[aria-describedby]").get(0) != this) {
//                 $("[aria-describedby]").popover("hide");
//                 $(this).popover("show");
//             } else {
//                 $(this).popover("hide");

//             }
//         }
//     });
//     if (false) {
//         if (f != "orig") {
//             for (var ayahId in allData) { // for every word
//                 var ddd = allData[ayahId];
//                 // for (var i in d.Raw) { // for every word
//                 for (var j in ddd) {
//                     for (var i in ddd[j]) {
//                         // if (ddd[j][i])
//                         if (!ddd[j][i][feature]) {
//                             for (var k in ddd[j][i].analyses) {
//                                 $("." + ayahId + "-" + i + "-" + j + "-" + k).attr("data-content", JSON.stringify(d[j][i].analyses[k], null, 2)).popover({
//                                     placement: placementFunc,
//                                     trigger: "manual",
//                                 });;
//                             }
//                         } else {
//                             $("." + ayahId + "-" + i + "-" + j).attr("data-content", JSON.stringify(d[j][i], null, 2)).popover({
//                                 placement: placementFunc,
//                                 trigger: "manual",
//                             });
//                         }
//                     }
//                 }
//             }
//         } else {
//             $(".orig").each(function() {
//                 $(this).attr("title", $(this).text());
//                 $(this).text("Hover Here").tooltip({
//                     placement: "right"
//                 });;
//             });
//         }
//     }

//     return {};
// }