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