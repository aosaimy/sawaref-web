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