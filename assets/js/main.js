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