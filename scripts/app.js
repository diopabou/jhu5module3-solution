(function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .controller('foundItemsDirectiveController', foundItemsDirectiveController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', foundItemsDirective);
// davids-restaurant.herokuapp.com/menu_items.json


function foundItemsDirective(){

  var ddo = {
    scope: {
      found : '<',
      onRemove: '&'
    },
   controller:'foundItemsDirectiveController as foundItems',
    bindToController: true,
    templateUrl: 'listitem.html'
  };

  return ddo;
}

function foundItemsDirectiveController(){
  var foundItems = this;

}


NarrowItDownController.$inject = ['MenuSearchService']
  function NarrowItDownController(MenuSearchService){
    var narrowItems = this;
    narrowItems.searchTerm = "";

    narrowItems.removeItem = function(index){
        narrowItems.found.splice(index, 1);
    }
    narrowItems.findItems = function(searchTerm){
      narrowItems.errorMessage = false;
      if (searchTerm == ""){
        narrowItems.errorMessage = true;
        narrowItems.found = [];
        return;
      }
      var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
      promise.then(function(result){
        narrowItems.found  = result;
        if(narrowItems.found.length == 0){
          narrowItems.errorMessage = true;
        }
      });
    }
}
MenuSearchService.$inject = ['$http']
function MenuSearchService($http){
  var service = this;

  service.getMatchedMenuItems = function(searchTerm){

    return $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
    }).then(function(result){
      var foundItems = [];
      for(var item in result.data.menu_items){
        if(result.data.menu_items[item].description.indexOf(searchTerm) !== -1){
            foundItems.push(result.data.menu_items[item])
          }
      }
    return foundItems;

  });


  }

}

})();
