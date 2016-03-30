

var app = angular.module('starter', ['ionic', 'firebase']);

//run

app.run(function(Factory, $interval, $window, $ionicPlatform, $state,  $rootScope, $timeout) {
  $ionicPlatform.ready(function() {
  
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {

      StatusBar.styleDefault();
    
    }
    
    
    $rootScope.newRego = false;
    
    $rootScope.reload = function(){
      $window.location.reload();
    };
    


    $rootScope.connect = Factory.connect;
    $rootScope.verSupport = Factory.verSupport;

      
    $rootScope.setting = {play: false};

  
  $rootScope.parentGo = function(){Factory.parentGo();};
  $rootScope.currentTime = Factory.currentTime;
  $interval(function(){
    Factory.timeOrder = $rootScope.newOrder;
    Factory.interval(function(currentTime){
      $rootScope.currentTime = currentTime;
    });
  },60000);
    

    var auth = null;
    
        $rootScope.auth = Factory.auth;
        
        
        
      function anonAuth(){  
        $rootScope.auth.$authAnonymously().then(function(authData) {
          console.log("Logged in as:", authData.uid);
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
      }
      
      $rootScope.userInfoReset = {email: ''};
      
      $rootScope.resetPassword = function(userInfoReset){
        $rootScope.auth.$resetPassword({
          email: userInfoReset.email
        }).then(function() {
          console.log("Password reset email sent successfully!");
        }).catch(function(error) {
          console.error("Error: ", error);
        });
        
      };
      
      $rootScope.userInfoRegister = {email: '', password: '', firstName: '', lastName: '', phone: ''};
      
      $rootScope.registerNewUser = function(userInfoRegister){
        console.log('is this firing?');
        var info = userInfoRegister;
        console.log(info.email + " " + info.password);
        $rootScope.auth.$createUser({email: info.email, password: info.password}).then(function(userData) {
            var user = Factory.user(userData);
            console.log('inside rego firstName: ' + info.firstName);
            user.firstName = info.firstName;
            user.lastName = info.lastName;
            user.phone = info.phone;
            user.$save().then(function(ref){console.log('ref succcess')}, function(error){console.log('error occured');});
            Factory.addUser(userData, 10);
        }).catch(function(error) {});
      };
        
      $rootScope.valid = true;   
        
      $rootScope.goReg= function(){
        $rootScope.valid = true;
        $state.go('app.menu.main.login.reg');
      };
      
      $rootScope.goLogin= function(){
        $rootScope.valid = true;
        $state.go('app.menu.main.login');
      };  
      
      
      
      $rootScope.phoneRegInfo = {firstName: '', lastName: '', phone: ''};      
      $rootScope.phoneReg = function(firstNameIn, lastNameIn, phoneIn){
      
        $rootScope.valid = false;
        
        var firstName = firstNameIn.replace(/\s+/g, '');
        var lastName = lastNameIn.replace(/\s+/g, '');
        var phone = phoneIn.replace(/\s+/g, '');
        console.log(firstName + lastName + phone);
      
        if(!(firstName === '' || firstName === null || lastName === '' || lastName === null || phone === '' || phone === null || phone.length < 8)){
          $rootScope.valid = true;
          $rootScope.auth.$createUser({email: phone + "@foobar.com.au", password: phone}).then(function(userData) {
              var user = Factory.user(userData);
              user.firstName = firstName;
              user.lastName = lastName;
              user.phone = phone;
              console.log(user.firstName + user.phone);
              user.$save();
              Factory.addUser(userData, 10);
              $rootScope.userInfoLogin.phone = phone;
              $rootScope.login();
              $rootScope.userInfoLogin.phone = '';
              $rootScope.phoneRegInfo = {};
          }).catch(function(error) {}); 
        } else {
          $rootScope.valid = false;
        }
        
      }      
       

        $rootScope.auth.$onAuth(function(authData){
          $rootScope.authData = authData;
        
          
          function logInCus(authData){
      
      $rootScope.allowPay = Factory.allowPay;
      
      $rootScope.user = Factory.user(authData);
      $rootScope.user.$loaded(function(user){
        if(user.vend){
          $rootScope.goToMain(user.vend, authData);
        } else {
          $state.go('app.menu.main.store');
        }
      });
            
      $rootScope.vendList = Factory.vendList;
      
      $rootScope.goToMain = function(key, authData){
        $state.go('app.menu.main');
        $rootScope.vend = Factory.initVend(key);
        $rootScope.stock = Factory.initVendStock(key);
        $rootScope.stock.$loaded(function(data){
          console.log("length vend stock: " + data.length);
        });
        
        Factory.initOrder($rootScope.vend.$id, authData, function(order){
        $rootScope.newOrder = order;
        Factory.grandTotal();
        
        $rootScope.addItemAdvice = ItemAdvice(order.customList.length);
        
        $rootScope.search = {min: 0};      
      
      $rootScope.someList = Factory.custom(authData, $rootScope.vend.$id);
      
      $rootScope.searchChild = function(parent, name){
        $rootScope.searchParent = parent;
        $rootScope.searchList = Factory.initList(name, $rootScope.vend.$id);
      };
      
      $rootScope.searchParentF = function(name){
        Factory.parentF(name, $rootScope.vend.$id, function(level){
          $rootScope.searchParent = level.parent;
          $rootScope.searchList = level.list;
        });
      };
            
      $rootScope.searchChild('Root', 'All');
      
        });
      }
      
      $rootScope.initVend = function(index){
        var vendList = $rootScope.vendList;
        var key = vendList.$keyAt(index);
        Factory.newVend(authData, key);
        $rootScope.goToMain(key, authData);
      }
      
      
      $rootScope.showCustom = {yes: false, saved: true};
            
      $rootScope.timeGo = function(){
        $rootScope.timeSelect = Factory.initTimeSelect();
        $state.go('app.menu.main.confirm.time');
      }
            
      $rootScope.diyTotal = function(x){
        var total = x.price;
        angular.forEach(x.option, function(value1, key){
          angular.forEach(value1.item, function(value, key){
            if(value.include === true){
              total = Math.round((total + value.price) * 100)/100;
            }
          })
        })
        return total;
      }
           
      
            
      $rootScope.method = function(online){
        if(online){
          $rootScope.newOrder.method = true;
            Factory.newMethod(authData, true);
        } else {
          $rootScope.newOrder.method = false;
            Factory.newMethod(authData, false);
        }
        $state.go('app.menu.main.confirm');
      };
      
      
      
      
      
            
      $rootScope.setUpPayment = function(){

          Factory.init(authData, function(clientToken){
            $rootScope.disablePay = true;
            braintree.setup(clientToken.token, "dropin", {
              container: 'payment-form',
              paymentMethodNonceReceived: function (event, nonce) {
           

                  $rootScope.submitOrder(nonce);
           
              },
              onReady: function(){
                $timeout(function(){
                  $rootScope.disablePay = false;
                }, 0)
              }
      
              }, function(error){});  
            });
      }
      
      function ItemAdvice(length){
        var str = null
        if(length === 0){
              return 'Get started by adding an item';
        }
        return str;
      }
            
      
      $rootScope.viewOrder = {};
      
      
      
      $rootScope.orders = Factory.userOrders(authData);
      $rootScope.logout = function(){
        $rootScope.newOrder = {};
        //anonAuth();
        Factory.ref.unauth();
      };
      $rootScope.assignViewOrder = function(order){
       $rootScope.viewOrder = order;
       $state.go("app.menu.main.prepare");
       
      }
      $rootScope.confirm = function(){
        $state.go("app.menu.main.confirm");
      };
      $rootScope.newReference = function(){
        Factory.newReference(authData, $rootScope.newOrder.reference);
      }
      $rootScope.addMain = function(stock){
        Factory.addMain(stock); 
      }
      $rootScope.deductMain = function(stock){
        Factory.deductMain(stock);
      }
      $rootScope.toggleItem = function(item, show){
        if(item.include==false){
          item.include=true;
        } else {
          item.include=false;
        }
        show.yes = false;
      };
      $rootScope.toggle = function(show){
        if(show.yes==false){
          show.yes=true;
        } else {
          show.yes=false;
        }
      };
      
      $rootScope.addToCustom = function(stock){
        if(!stock.customId){
          Factory.addCustom(stock, stock.custom, $rootScope.authData.uid, $rootScope.vend.$id);
        }
      }
      
      $rootScope.removeFromCustom = function(stock){
        Factory.removeCustom(stock);
      }
      
      $rootScope.done = function(stock){
        $rootScope.stockCus = Factory.stockCopy(stock);
        console.log("report cus ID: " + $rootScope.stockCus.customId)
        Factory.totalStock();
        var custom = ''
        if($rootScope.stockCus.diy === true){
          custom = 'DIY';
        }
        $rootScope.addItemAdvice = null;
         Factory.addOrder($rootScope.stockCus, custom, $rootScope.authData.uid);
          $state.go("app.menu.main");
          Factory.grandTotal();
      };
      
      $rootScope.adjustName = function(stock){
        if(stock.customId){
          Factory.adjustName($rootScope.stockView.custom);
        }
        
      };
      
      $rootScope.adjustReference = function(){
        
      }
      
      $rootScope.viewStock = function(index, stock){
        $state.go('app.menu.main.modify');
        if(stock.customId){
          Factory.initCustomObj(stock.customId);
        }
        
        $rootScope.stockView = stock;
        $rootScope.newOrderIndex = index;
      };
      
      
      $rootScope.viewStockOrder = function(stock){
        $state.go('app.menu.main.prepare.contentorder');
        $rootScope.stockView = stock;
      };
      
      $rootScope.removeCustom = function(stock){
        if(stock.customId){
          Factory.removeCustom(stock);
        }
      }
      
      $rootScope.removeItem = function(index, stock){
        
        
        
        angular.forEach($rootScope.newOrder.customList, function(value, key){
          if(key === index){
            $rootScope.newOrder.customList.splice(index,1);
            Factory.grandTotal();
            $rootScope.addItemAdvice = ItemAdvice($rootScope.newOrder.customList.length);
            
          }
        });
        
      };

      $rootScope.priceAdjust = function(stock, item){
        if(stock.diy === true){
          Factory.priceAdjustStock(stock, item);
          if(stock.customId){
             Factory.priceAdjustCustom(item);
          }
        } else {
          item.include = true;
        }
        
      }  
    
      $rootScope.submitOrder = function(nonce){
        var orderCopy = angular.copy($rootScope.newOrder);
        $rootScope.newOrder = {};
        Factory.submit(nonce, orderCopy);
        Factory.initOrder($rootScope.vend.$id, authData, function(order){
          $rootScope.newOrder = order;
          $rootScope.addItemAdvice = ItemAdvice(order.customList.length);
        });
      };
      $rootScope.removeOrder = function(){
        if($rootScope.viewOrder.done === 'Order'){
          $state.go("app.menu.main.prepare.confirmcancel");
        } else {
          $state.go("app.menu.main.prepare.cannot");
        }
      };
      $rootScope.cancel = function(){
        var key = $rootScope.orders.$keyAt($rootScope.viewOrder);
        Factory.removeOrder(key);
        $state.go("app.menu.main");
      };
      
      
      Factory.hour.$loaded(function(data){
        $rootScope.open = data.open;
        $rootScope.close = data.close;
      });
      
      
      
      
      $rootScope.verifyProfile = function(bool){
        if($rootScope.newOrder.reference == null || $rootScope.newOrder.reference == ""
        ){
          $state.go("app.menu.main.confirm.verify");
        }
        else {
          var hour = new Date().getHours();
          if((hour < Factory.hour.open || hour >= Factory.hour.close) && Factory.order.ms === 9999999999999){
            $state.go("app.menu.main.confirm.closed");
          } else {
              if($rootScope.newOrder.total >= 5.00 || $rootScope.newOrder.method === false){
                if(bool === true){
                  console.log('bool true');
                    console.log('disable pay false');
                    document.getElementById("submitButton").click()
                } else {
                  console.log('bool false');
                  $rootScope.submitOrder(null);
                }
              } else {
                $state.go("app.menu.main.minpayment");
              }
          }
          
        }
      };
      

}




          function logInVend(authData){
            
 
            $rootScope.logout = function(){
              list.$destroy();
              //anonAuth();
              Factory.ref.unauth();
            };
            
      $rootScope.stock = Factory.initStockList(authData);
   
      $rootScope.orders = Factory.userOrders(authData);
      
      $rootScope.toggleItem = function(item, show){
        if(item.include==false){
          item.include=true;
        } else {
          item.include=false;
        }
        show.yes = false;
      };
      $rootScope.toggle = function(show){
        if(show.yes==false){
          show.yes=true;
        } else {
          show.yes=false;
        }
      };
    
  
  $rootScope.deductStock = function(stock){
      Factory.removeStock(stock);
  };

  $rootScope.deductOption = function(option){
    Factory.removeOption(option);
  };

  $rootScope.deductItem = function(item){
    Factory.removeItem(item);
  };
  
  $rootScope.setOrder = function(obj){
    obj.order = Factory.setOrder();
    var index  = $rootScope.stock.$indexFor(obj.stockId);
    $rootScope.stock.$save(index);
  };
  
  $rootScope.content = {stock: '', price: 0, uid: $rootScope.authData.uid};
  
  $rootScope.addStock = function(content){
     Factory.addStock($rootScope.content, function(data){
       $rootScope.content = data;
     });
  };
  
  $rootScope.option = {name: '', single: false};

  
  $rootScope.addOption = function(option, stock){
    Factory.addOption(option, stock, function(data){
      $rootScope.option = data;
    });
  };
  
  $rootScope.item = {name: '', price: 0, include: false};
  
   $rootScope.addItem = function(item, option){
  
    Factory.addItem(item, option, function(data){
      $rootScope.item = data;
    });
      
  };

      $rootScope.archive = Factory.list(authData);

      var list = Factory.initOrderList(authData);
      list.$watch(function(event) {
        
        if($state.current.name != "app.vend.music" && $rootScope.setting.play === true && event.event === "child_added"){
          var obj = list.$getRecord(event.key);
          if(obj.done === 'Order'){
              $state.go("app.vend.music");
              
            } 
        }
        
      });
     
       $rootScope.order = list;
        
      $rootScope.userInfo2 = {phone:''};        
    $rootScope.register = function() {
        $rootScope.auth.$createUser({email: $rootScope.userInfo2.phone + "@foobar.com.au", password: $rootScope.userInfo2.phone}).then(function(userData) {
            $rootScope.userInfo2.phone = '';
            Factory.addUser(userData, 10);
        }).catch(function(error) {});
    };
    
 
  $rootScope.prepared = function(order){
    
    

      if(order.done == "Order"){
        
        order.done = "Preparing";
        
        $rootScope.order.$save(order);
       
       
      }
      else if(order.done == "Preparing"){
        
        order.done = "Ready";
        $rootScope.order.$save(order);
       
       
      }
      else if(order.done == "Ready"){

        order.done = "Picked-Up";
        $rootScope.order.$save(order).then(function(ref){
          Factory.add(ref.key());
          
        });
        
      }
      else if(order.done == "Picked-Up"){

        order.done = "Cancel";
        $rootScope.archive.$save(order);
      }
      else if(order.done == "Cancel"){
        console.log('cancel');
        order.done = "Order";
        $rootScope.archive.$save(order).then(function(ref){
          Factory.remove(ref.key());
        });
      }
      
      
  };
  

}



 function logInAdmin(authData){
   
   
   $rootScope.image = Factory.image;
   
   $rootScope.onChange = function(element){
    console.log("file read??");
     $rootScope.$apply(function(scope) {
         var photofile = element.files[0];
         var reader = new FileReader();
         reader.onload = function(e) {
           var img = Factory.image;
           img.$value = reader.result;
           img.$save();
            console.log(reader.result);
         };
    
         reader.readAsDataURL(photofile);
        
     });
    
   };
   
            
    $rootScope.logout = function(){
      Factory.ref.unauth();
    };
          
    $rootScope.newVend = {phone:'', firstName:'', lastName:'', address:'', suburb:'', postcode: ''};        
    $rootScope.register = function() {
        $rootScope.auth.$createUser({email: $rootScope.newVend.phone + "@foobar.com.au", password: $rootScope.newVend.phone}).then(function(userData) {
            Factory.addUser(userData, 20);
            var vend = Factory.initVend(userData);
            vend.firstName = $rootScope.newVend.firstName;
            vend.lastName = $rootScope.newVend.lastName;
            vend.phone = $rootScope.newVend.phone;
            vend.address = $rootScope.newVend.address;
            vend.suburb = $rootScope.newVend.suburb;
            vend.postcode = $rootScope.newVend.postcode;
            vend.$save();
            $rootScope.newVend = {}; 
        }).catch(function(error) {});
    };
    
}

  if(authData != null){
    
    
    console.log('is this loading? init');
    Factory.getUser(authData, function(user){
      console.log('is this loading?');
      if(user.type === 10){
          console.log('is this loading? 10');
            logInCus(authData);
            //$
      } else if(user.type === 20){
        logInVend(authData);
        $state.go('app.vend');
      } else if(user.type === 30) {
        logInAdmin(authData);
        $state.go('app.admin');
      }
    });
    
    
    
  }
  else {
    
    //anonAuth();
    $state.go('app.menu.main.login');
  }
});
        
    
        $rootScope.userInfoLogin = {phone: '', email: '', password: ''};
        $rootScope.login = function(){
          
          if($rootScope.newRego === false){
            
             //anonCustomList = angular.copy($rootScope.newOrder.customList);
             
            $rootScope.auth.$authWithPassword({email: $rootScope.userInfoLogin.phone + '@foobar.com.au', password: $rootScope.userInfoLogin.phone}).then(function(authData) {
              $rootScope.userInfoLogin.email = '';
              $rootScope.userInfoLogin.password = '';
              $rootScope.userInfoLogin.phone = '';
              $rootScope.valid = true;
            }).catch(function(error) { $rootScope.valid = false});
          } else {
            $rootScope.auth.$authWithPassword({email: $rootScope.userInfoLogin.email, password: $rootScope.userInfoLogin.password}).then(function(authData) {
              $rootScope.userInfoLogin.email = '';
              $rootScope.userInfoLogin.password = '';
              $rootScope.userInfoLogin.phone = '';
            }).catch(function(error) {});
          }
          
          
          
        };
  

  });
});

//con

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.views.maxCache(0);
  
  

  $stateProvider

  
    
  .state('reset', {   
    templateUrl: "templates/reset.html"
    })
    
  .state('register', {   
    templateUrl: "templates/register.html"
    })


  .state('app', {
    templateUrl: 'templates/menu.html'

  })
  
  .state('app.menu', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/setting.html'
      }
    }
  })

  .state('app.menu.main', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/main.html'
      }
    }
  })
  
  .state('app.menu.main.store', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/store3.html'
      }
    }
  })
  
  .state('app.menu.main.login', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/loginBlah.html'
      }
    }
  })
  
  .state('app.menu.main.login.reg', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/reg.html'
      }
    }
  })
  
  .state('app.menu.main.minpayment', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/minpayment.html'
      }
    }
  })
  
  
  .state('app.menu.main.failure', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/failure.html'
      }
    }
  })
  
  .state('app.menu.main.confirm', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/confirm.html',
        controller: function($rootScope){
          $rootScope.disablePay = true;
          if($rootScope.newOrder.method === true){
            $rootScope.setUpPayment();
          }
        }
      }
    }
  })
  
  .state('app.menu.main.confirm.closed', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/closed.html'

       
      }
    }
  })
  
  .state('app.menu.main.confirm.verify', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/verify.html'
      }
    }
  })
  
  
   .state('app.menu.main.confirm.time', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/time.html'
      }
    }
  })
  
   .state('app.menu.main.prepare', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/prepare.html'
      }
    }
  })
  
  .state('app.menu.main.prepare.cannot', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/cannot.html'
      }
    }
  })
  
  .state('app.menu.main.prepare.confirmcancel', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/confirmcancel.html'
      }
    }
  })
  

  
  .state('app.menu.main.modify', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/modify.html'
      }
    }
  })
  
  .state('app.menu.info',{
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/info.html'
      }
    }
  })
  
  .state('app.menu.main.new', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/new.html'
      }
    }
  })
  
   .state('app.menu.main.content', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/content.html'
      }
    }
  })
  
  .state('app.menu.main.confirm.reference', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/reference.html'
      }
    }
  })
  
  .state('app.menu.main.prepare.contentorder', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/contentorder.html'
      }
    
    }
  })

  
  
  .state('app.menu.main.confirm.payment', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cus/payment.html'
      }
    }
  })
  
  
  .state('app.vend', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/vend/order.html'
      }
    }
  })
  
  
  
  .state('app.vend.set.signup', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/vend/signup.html'
      }
    }
  })
  
  .state('app.vend.set.done', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/vend/done.html'
      }
    }
  })
  
  .state('app.vend.set.stock', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/vend/stock.html'
      }
    }
  })
  
  .state('app.vend.music', {
    views: {
     'menuContent@app':{
       templateUrl: 'templates/vend/music.html'
     }
    }

  })
  
  
  .state('app.vend.set', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/vend/set.html'
      }
    }
  })
  
  
  .state('app.admin', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/order.html'
      }
    }
  })
  
  .state('app.admin.set.signup', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/signup.html'
      }
    }
  })
  
  .state('app.admin.set.done', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/done.html'
      }
    }
  })
  
  .state('app.admin.music', {
    views: {
     'menuContent@app':{
       templateUrl: 'templates/admin/music.html'
     }
    }

  })
  
  .state('app.admin.set.newtime', {
    views: {
      'menuContent@app':{
        templateUrl: 'templates/admin/newtime.html'
      }
    }
  })
  
  .state('app.admin.set', {
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/set.html'
      }
    }
  })
  
  
})

//dir

.directive('test', function() {
  return {
    templateUrl: 'templates/vend/test.html'
  };
});

//fac


app.factory('Factory', function($firebaseArray, $firebaseObject, $firebaseAuth, $state){
  
  
  var self = this;
  
  //fire
  
  self.ver = 'v023';
  self.root = new Firebase("https://popping-heat-6081.firebaseio.com/");
  self.ref = self.root.child('test');
  self.connect = $firebaseObject(self.root.child(".info").child("connected"));
  self.verSupport = $firebaseObject(self.ref.child('ver').child(self.ver));
  self.auth = $firebaseAuth(self.ref);
  
  
  self.user = function(authData){
      self.userObj = $firebaseObject(self.ref.child("cus").child(authData.uid));
      return self.userObj;
    }
  
  
  //timefactory
  
  self.timeSelect = null;
  self.initTimeSelect = function(){
    self.timeSelect = $firebaseArray(self.ref.child("time").orderByChild("ms").startAt(self.currentTime).limitToFirst(24));
    return self.timeSelect;
  };
  self.currentTime = new Date().getTime();
  self.timeOrder = null;
  self.interval = function(callback){
      if(self.timeOrder != null) {
        self.currentTime = new Date().getTime();
        callback(self.currentTime);
        if(self.currentTime > self.timeOrder.ms){
          var found = false;
          angular.forEach(self.timeSelect, function(value, key){
            if(value.ms > self.currentTime && found === false){
              self.timeOrder.ms = value.ms;
              found = true;
            }
          });
        }
      }
  }
  
  //time
  
  self.time = $firebaseObject(self.ref.child("time"));
  

  self.addUser = function(authData, type){
    self.ref.child('user').child(authData.uid).child('type').set(type);
  };
  
  
  self.parentGo = function(){
    $state.go('^');
  }
  
  
  //search
  
  var parent = null;
  var listSearch = null;
  self.parentF = function(name, key, callback){
    self.ref.child("search").child(key).child(name).once('value', function(dataSnapshot){
      var parent = dataSnapshot.val().parent;
      $firebaseArray(self.ref.child("search").child(key).orderByChild("parent").equalTo(name)).$loaded(function(listSearch){
        callback({parent: parent, list: listSearch});
      });
    });
  };
  self.initParent = function(par){
    self.ref.child("search").child(par).once('value', function(dataSnapshot){
      var parent = dataSnapshot.val().parent;
      self.ref.child("search").child(parent).once('value', function(dataS){
        return dataS.val();
      });
      
    })
  };
  self.initList = function(name, key){
    listSearch = $firebaseArray(self.ref.child("search").child(key).orderByChild("parent").equalTo(name));
    return listSearch;
  };
  

    
  self.startCus = function(){
    
    //client token
  var beingCalled = false;
  self.init = function(authData, callback){
    if(beingCalled === false){
      beingCalled = true;
      var push = self.ref.child("clientToken").push();
      var key = push.key()
      push.set({"token": "NA", "customerId": authData.uid}, function(){
           
      });
      self.ref.child("clientToken").child(key).on('value', function(dataSnapshot){
        if(dataSnapshot.val().token != 'NA'){
          self.ref.child("clientToken").child(key).off();
          self.ref.child("clientToken").child(key).remove();
          callback(dataSnapshot.val());
          beingCalled = false;
        }
      });
    }
  }

    
    self.hour = $firebaseObject(self.ref.child('hour'));

    self.vendList = $firebaseArray(self.ref.child("vend"));
    self.initVend = function(key){
      self.vend = $firebaseObject(self.ref.child("vend").child(key));
      return self.vend;
    };
    self.initVendStock = function(key){
      self.vendStock = $firebaseArray(self.ref.child("stock").orderByChild("vend").equalTo(key));
      return self.vendStock;
    }
    
    
    //cus
  
  
    self.newVend = function(authData, vend){
      self.ref.child("cus").child(authData.uid).child('vend').set(vend);
    };
    self.newReference = function(authData, reference){
      self.ref.child("cus").child(authData.uid).child('profile').child('reference').set(reference);
    }
    self.newMethod = function(authData, method){
      self.ref.child("cus").child(authData.uid).child('profile').child('method').set(method);
    }
    
      

    //cus
    
    self.stock = null;
  self.item = null;

  self.stockCopy = function(stock){
    self.stock = angular.copy(stock);
    return self.stock;
  };

  self.totalStock = function(){
    self.stock.total = self.stock.price;
    angular.forEach(self.stock.option, function(value, key){
      angular.forEach(value.item, function(value, key){
        if(value.include === true){
          self.stock.total = Math.round((self.stock.total + value.price) * 100)/100;
        }
      })
    })
  }

  
  self.priceAdjustStock = function(stock, item){
    console.log('does pa fire?');
    self.stock = stock;
    self.item = item;
    var option = self.stock.option[self.item.optionId];
    var itemArray = option.item;
    if(option.single === true){
      console.log('is option single?');
      angular.forEach(itemArray, function(value, key){
        if(value.itemId === item.itemId){
          value.include = true;
          
        } else {
          value.include = false;
        }
        
      });
    }
    
    self.totalStock();
    self.grandTotal();
  }
  
  
  
  //orderfactory
  
  self.order = {};
  self.allowPay = true;
  self.initOrder = function(vendKey, authData, callback){
    var user = self.user(authData);
    user.$loaded(function(data){

          var reference = "e.g. John";
          var method = false;
          if(data.profile != null) {
            if(data.profile.reference != null){
              reference = data.profile.reference;
            }
            if(data.profile.method != null && self.allowPay){
              method = data.profile.method;
            }
          }
          var mobile = 'anon';
          if(authData.password != null){
            mobile = authData.password.email;
          }

          self.order = {vend: vendKey, method: method, total: 0, ms: 9999999999999, mobile: mobile, order: 0, reference: reference , done: "Order", user: authData.uid, customList: []};
          return callback(self.order);
   
    });
  }
  self.grandTotal = function(){
    self.order.total = 0;
    angular.forEach(self.order.customList, function(value, key){
      self.order.total = self.order.total + value.qty * value.total;
      self.order.total = Math.round(self.order.total * 100)/100;
    });
  }
  
  self.addOrder = function(stock, custom, user, callback){
    stock.custom = custom;
    stock.user = user;
    if(!stock.customId){
      stock.customId = null;
    }
    self.order.customList.push({
      customId: stock.customId,
      custom: stock.custom, 
      option: stock.option, 
      order: stock.order, 
      price: stock.price, 
      stock: stock.stock, 
      stockId: stock.stockId, 
      total: stock.total, 
      user: stock.user,
      diy: stock.diy,
      qty: 1
    });
  }
  
  
  self.submit = function(nonce, orderCopy){
    
 
      var order = $firebaseArray(self.ref.child("order").limitToFirst(1));
      orderCopy.order = Firebase.ServerValue.TIMESTAMP;
      orderCopy.status = 'NA';
      if(nonce != null){
        orderCopy.nonce = nonce;
      }
      if(orderCopy.method === false){
        $state.go("app.menu.main");
      }
      order.$add(orderCopy).then(function(ref){
        if(orderCopy.method === true){
          self.check(ref.key(), function(authorized){
            if(authorized === false){
              console.log('removing failed order');
              self.ref.child("order").child(ref.key()).remove();
            }
          });
        }
      });
     
}

  self.removeOrder = function(key){
    var obj = $firebaseObject(self.ref.child("order").child(key));
    obj.$remove();
  };
  
  self.userOrdersList = null;
  
  self.userOrders = function(authData){
    self.userOrdersList = $firebaseArray(self.ref.child("order").orderByChild("user").equalTo(authData.uid));
    return self.userOrdersList;
  };
  
  
  
  self.modifyOrder = function(newId){
    var list = self.userOrdersList;
    var index = 0;
    angular.forEach(list, function(value, key){
      list[index].user = newId;
      list.$save(index);
      index++;
    })
  };
  
  self.addMain = function(stock){
    stock.qty++;
    self.grandTotal(); 
  }

  self.deductMain = function(stock){
    if(stock.qty != 0){
      stock.qty--
      self.grandTotal();
    }
  };
  
  //customfactory
  
  self.customObj = null;
  self.initCustomObj = function(customId){
    self.customObj = $firebaseObject(self.ref.child("custom").child(customId));
    return self.customObj;
  };
  self.customList = null;
  self.custom = function(authData, key){
    self.customList = $firebaseArray(self.ref.child("custom").orderByChild("cusVend").equalTo(authData.uid+key));
    console.log("cus lis length" + self.customList.length);
    return self.customList;
  }
  
  self.modifyCustomList = function(newId){
    var list = self.customList;
    var index = 0;
    angular.forEach(list, function(value, key){
      list[index].user = newId;
      list.$save(index);
      index++;
    })
  }
  
  
  
   self.total = function(){
    console.log('is total firing?');
    self.customObj.total = self.customObj.price;
    console.log('after cus?');
    angular.forEach(self.customObj.option, function(value, key){
      angular.forEach(value.item, function(value, key){
        if(value.include === true){
          console.log("new total: " + Math.round((self.customObj.total + value.price) * 100)/100)
          self.customObj.total = Math.round((self.customObj.total + value.price) * 100)/100;
        }
      })
    })
  }
  self.adjustName = function(newName){
    self.customObj.custom = newName;
    self.customObj.$save();
  }
  self.priceAdjustCustom = function(item){
    
    var cusItem = self.customObj.option[item.optionId].item[item.itemId];
    var option = self.customObj.option[item.optionId];
    var itemArray = option.item;
    if(option.single === true){
      angular.forEach(itemArray, function(value, key){
        if(value.itemId === item.itemId){
          value.include = true;
       
          
        } else {
          value.include = false;

        }
        
      });
    } else {
      cusItem.include = item.include;
    }
    
    self.total();
    self.customObj.$save();
  }
  self.addCustom = function(stock, custom, user, vendKey){
    stock.custom = custom;
    stock.user = user;
    var push = self.ref.child("custom").push();
    stock.customId = push.key();
    push.set({
      customId: stock.customId, 
      custom: stock.custom, 
      option: stock.option, 
      order: stock.order, 
      price: stock.price, 
      stock: stock.stock, 
      stockId: stock.stockId, 
      total: stock.total, 
      user: stock.user,
      diy: stock.diy,
      qty: 0,
      vend: vendKey,
      cusVend: stock.user+vendKey
        
    }, function(ref){
      
    });
  }
  self.removeCustom = function(stock){
    var obj = $firebaseObject(self.ref.child("custom").orderByChild("customId").equalTo(stock.customId));
      obj.$remove().then(function(ref){
        stock.customId = null;
      });
  }
  
  //status
  
  self.check = function(key, callback){
    var obj = self.ref.child("order").child(key).child("status");
    obj.on('value', function(dataSnapshot){
        var status = dataSnapshot.val();
        if(status === 'NA'){
          console.log('NA');
        } else if(status === 'Authorized') {
          obj.off();
          $state.go("app.menu.main");
          callback(true);
          console.log('authorized');
          
        } else {
          $state.go("app.menu.main.failure");
          obj.off();
          callback(false);
          console.log('not authorized');
        }
    });
  };
  
    
    
  }
  
  
  self.startVend = function(){

    
   self.orderList = null;
   self.initOrderList = function(authData){
     self.orderList = $firebaseArray(self.ref.child("order").orderByChild("vend").equalTo(authData.uid));
     return self.orderList;
   };
  
  
  self.list = function(authData){
    self.archive = $firebaseArray(self.ref.child('archive').orderByChild("vend").equalTo(authData.uid));
    return self.archive;
  };
  
  self.add = function(key){
    self.ref.child('order').child(key).once('value', function(dataSnapshot){
      self.ref.child('archive').child(key).set(dataSnapshot.val());
      self.ref.child('order').child(key).remove();
    });
  };
  self.remove = function(key){
    self.ref.child('archive').child(key).once('value', function(dataSnapshot){
      self.ref.child('order').child(key).set(dataSnapshot.val());
      self.ref.child('archive').child(key).remove();
    });
  };
    
    
    self.initVend = function(authData){
      self.vend = $firebaseObject(self.ref.child("vend").child(authData.uid));
      return self.vend;
    };
    
     self.initStockList = function(authData){
    self.objStock = $firebaseArray(self.ref.child("stock").orderByChild("vend").equalTo(authData.uid)); 
    return self.objStock;
  };
    
    self.removeStock = function(stock){
    self.objStock.$remove(stock);
  };
  self.removeOption = function(option){
    var obj = $firebaseObject(self.ref.child("stock").child(option.stockId).child("option").child(option.optionId));
    obj.$remove();
  }
  self.removeItem = function(item){
    var obj = $firebaseObject(self.ref.child("stock").child(item.stockId).child("option").child(item.optionId).child("item").child(item.itemId));
    obj.$remove();
  }
  
  self.setOrder = function(){
    return Firebase.ServerValue.TIMESTAMP;
  }
  
  self.addStock = function(content, callback){
    var push = self.ref.child("stock").push()
      push.set({
        "stockId": push.key(),
        "stock":content.stock,
        "custom": '',
        "price":content.price,
        "total": 0,
        "order": Firebase.ServerValue.TIMESTAMP,
        "vend": content.uid
      }, function(ref){
        callback({stock: '', price: 0, uid: ''})
      });
  };
  self.addOption = function(option, stock, callback){
    var key = stock.stockId;
    var push = self.ref.child("stock").child(key).child("option").push();
    push.set({
      "optionId": push.key(),
      "stockId": stock.stockId,   
      "name": option.name,
      "single": option.single,
      "order": Firebase.ServerValue.TIMESTAMP
    }, function(ref){});
      callback({name: '', single: false});
  };
  self.addItem = function(item, option, callback){
     var push = self.ref.child("stock").child(option.stockId).child("option").child(option.optionId).child("item").push();
    
    function validate(){
      if(item.include != true){
        item.include = false;
      }
      return item.include;
    }
    push.set({
      "itemId": push.key(),
      "optionId": option.optionId,
      "stockId": option.stockId,
      "name": item.name,
      "price": item.price,
      "include": validate(),
      "order": Firebase.ServerValue.TIMESTAMP
    }, function(ref){
      callback({name: '', price: 0, include: false})
    });
  };
    
    
  }
  
  
   function User(authData){
    this.getUser = function(callback){
      if(authData != null){
        this.authData = authData;
        self.ref.child('user').child(authData.uid).once('value', function(dataSnapshot){
          if(dataSnapshot.val() === null){
            self.ref.unauth();
            this.type = -10
            callback(this);
          } else {
            this.type = dataSnapshot.val().type;
            if(this.type === 10){
              self.startCus();
            } else if(this.type === 20){
              self.startVend();
            } else if(this.type === 30){
              self.image = $firebaseObject(self.ref.child('image'));
              
            }
            callback(this);
          }
        });
      }
    }
  }

  self.getUser = function(authData, callback) {
    (new User(authData)).getUser(callback);
  }
  
  

  

  return self;
});








