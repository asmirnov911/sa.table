angular.module('sa.table', []).directive('saTable', function () {

    return {
        restrict: 'E',
        replace: true,
        //TODO fix route (embed template in js file)
        templateUrl: '../src/table.html',
        scope: {
            service: '=',
            columns: '=',
            isLoading: '=',
            toHideIdColumn: '='
        },
        controller: function ($scope) {

            $scope.items = [];
            $scope.current = null;

            $scope.onDateChanged = function (date) {
                //TODO get rid of this dependency
                date = moment(date).zone(0).startOf('day').toDate();
                return date;
            };

            $scope.add = function () {
                $scope.current = {};
            };

            $scope.edit = function (item) {
                $scope.current = angular.extend({}, item);
            };

            $scope.delete = function (item) {
                if (confirm('Are you sure you want to delete record?')) {
                    //TODO add loading indicator
                    $scope.service.delete(item.id).then(function () {
                        $scope.items.splice($scope.items.indexOf(item), 1);
                    });
                }
            };

            $scope.save = function (original) {
                //TODO add loading indicator and lock table for editing

                var current = $scope.current;

                if (!current) {
                    throw new Error('Attempt to save current object while it isn\'t set.');
                }

                var save = function () {
                    $scope.service.save(current).then(function (data) {

                        var index = 0;
                        while (index < $scope.items.length && $scope.items[index].id != data.id) {
                            index++;
                        }
                        if (index == $scope.items.length) index = -1;

                        //replace with saved
                        if (index > -1) {
                            //existing
                            $scope.items.splice(index, 1, data);
                        } else {
                            //new
                            $scope.items.splice(0, 0, data);
                        }
                        $scope.current = null;
                    }, function (err) {
                        alert(err.message);
                        //toastr.warning(err.message);
                    });
                };

                if ($scope.service.validate) {
                    $scope.service.validate(current, original).then(
                        save,
                        function (err) {
                            alert(err.message);
                            //toastr.warning(err.message);
                        }
                    );
                }
                else {
                    save();
                }
            };

            $scope.cancel = function () {
                $scope.current = null;
            };

            $scope.isEditRow = function (item) {
                if (!item) {
                    return true;
                }
                return $scope.current && $scope.current.id == item.id;
            };

            $scope.search = function (item) {
                if (!item) return false;
                if (!$scope.query) return true;

                if ($scope.columns) {
                    for (var i = 0; i < $scope.columns.length; i++) {
                        var fieldName = $scope.columns[i].fieldName;
                        if (item[fieldName]
                            && typeof item[fieldName] == 'string'
                            && item[fieldName].toUpperCase().indexOf($scope.query.toUpperCase()) != -1) {
                            return true;
                        }
                    }
                }

                return false;
            };

            //TODO add loading indicator
            $scope.service.list().then(function (data) {
                $scope.items = data || [];
            }, function (err) {
                alert(err.message);
                //toastr.warning(err.message);
            });

            $scope.lookup = function (lookup, valueMember, displayMember, value) {
                var i = 0;
                while (i < lookup.length && lookup[i] != value) {
                    i++;
                }
                return (i < lookup.length ? lookup[i] : {})[displayMember];
            };
        }
    };
});