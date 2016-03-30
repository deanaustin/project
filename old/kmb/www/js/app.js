var app = angular.module('starter', ['ionic', 'firebase']);

//run

app.run(function(Hour, NavigateFactory, Time, OrderList, SupportFactory, TimeFactory, StockFactory, CustomFactory, OrderFactory, UserFactory, AuthFactory, SupportFactory, Fire, $interval, $window, $ionicPlatform, $state,  $rootScope, $timeout) {
  $ionicPlatform.ready(function() {
  
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {

      StatusBar.styleDefault();
    
    }


    $rootScope.connect = Fire.connect;
    $rootScope.support = SupportFactory.obj;
    
    
       $rootScope.removeSupport = function(ver){
      SupportFactory.removeSupport(ver);
    };
    
    $rootScope.giveSupport = function(ver){
      SupportFactory.giveSupport(ver);
    };
  
    
    $rootScope.setting = {play: false};
    
    $rootScope.jsSubmit = function(){
      $rootScope.verifyProfile();
      
    };

  
  
  $rootScope.parentGo = function(){NavigateFactory.parentGo();};
  $rootScope.currentTime = TimeFactory.currentTime;
  $rootScope.timeSelect = TimeFactory.timeSelect;
  $interval(function(){
    TimeFactory.order = $rootScope.newOrder;
    TimeFactory.interval(function(currentTime){
      $rootScope.currentTime = currentTime;
    });
  },60000);
    
    
    
    
    $rootScope.support.$loaded(function(x){
    var auth = null;
    
      if(x.status===true){
        $rootScope.auth = AuthFactory.auth;

        $rootScope.auth.$onAuth(function(authData){
          $rootScope.authData = authData;
          function loggedIn(authData){
            
         

  
      $rootScope.stock = StockFactory.obj;
      $rootScope.viewOrder = {};
      OrderFactory.init(authData, function(order){
        $rootScope.newOrder = order;
      });
      $rootScope.orders = OrderFactory.userOrders(authData);
      $rootScope.logout = function(){
        list.$destroy();
        $rootScope.newOrder = {};
        Fire.ref.unauth();
      };
      $rootScope.assignViewOrder = function(order){
       $rootScope.viewOrder = order;
       $state.go("app.main.prepare");
       
      }
      $rootScope.confirm = function(){
        $state.go("app.main.confirm");
      };
      $rootScope.newReference = function(){
        UserFactory.newReference(authData, $rootScope.newOrder.reference);
        $state.go('app.main.confirm');
      }
      $rootScope.addMain = function(stock){
        OrderFactory.addMain(stock); 
      }
      $rootScope.deductMain = function(stock){
        OrderFactory.deductMain(stock);
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
      $rootScope.done = function(){
        var custom = 'NameMe!'
        CustomFactory.add($rootScope.stockCus, custom, $rootScope.authData.uid, function(ref){
         
        });
         OrderFactory.add($rootScope.stockCus, custom, $rootScope.authData.uid);
          $state.go("app.main");
      };
      
      $rootScope.adjustName = function(){
        CustomFactory.adjustName($rootScope.stockView.custom);
      };
      
      $rootScope.viewStock = function(stock){
        $state.go('app.main.modify');
        CustomFactory.init(stock.customId);
        $rootScope.stockView = stock;
      };
      $rootScope.viewStockOrder = function(stock){
        $state.go('app.main.prepare.contentOrder');
        $rootScope.stockView = stock;
      };
      $rootScope.adjustStock = function(stock){
        $state.go('app.main.new.save');
        $rootScope.stockCus = StockFactory.stockCopy(stock);
        StockFactory.total();
        $rootScope.done();
      };
      $rootScope.removeCustom = function(){
        CustomFactory.remove($rootScope.stockView);
        angular.forEach($rootScope.newOrder.customList, function(value, key){
          if(value.customId === $rootScope.stockView.customId){
            $rootScope.newOrder.customList.splice($rootScope.newOrder.customList.indexOf(value),1);
            OrderFactory.grandTotal();
            $state.go('app.main');
          }
        });
        
      };
      $rootScope.save = function(){
        $state.go('app.main.new.save.name');
      };
      $rootScope.priceAdjust = function(stock, item){
        StockFactory.priceAdjust(stock, item);
        CustomFactory.priceAdjust(item);
      }  
      $rootScope.confirmsubmit = function(){
        $rootScope.verifyProfile();
      }
      
      
      
      $rootScope.submitOrder = function(){
        var orderCopy = angular.copy($rootScope.newOrder);
        $rootScope.newOrder = {};
        OrderFactory.submit(orderCopy)
        OrderFactory.init(authData, function(order){
          $rootScope.newOrder = order;
        });
        $state.go("app.main"); 
      };
      $rootScope.removeOrder = function(){
        if($rootScope.viewOrder.done === 'Order'){
          $state.go("app.main.prepare.confirmcancel");
        } else {
          $state.go("app.main.prepare.cannot");
        }
      };
      $rootScope.cancel = function(){
        var key = $rootScope.orders.$keyAt($rootScope.viewOrder);
        OrderFactory.remove(key);
        $state.go("app.main");
      };
      
      $rootScope.open = Hour.obj.open;
      $rootScope.close = Hour.obj.close;
      
      
      $rootScope.verifyProfile = function(){
        if($rootScope.newOrder.reference == null || $rootScope.newOrder.reference == ""
        ){
          $state.go("app.main.confirm.verify");
        }
        else {
          var hour = new Date().getHours();
          if((hour < Hour.obj.open || hour >= Hour.obj.close) && OrderFactory.order.ms === 9999999999999){
            $state.go("app.main.confirm.closed");
          } else {
  
              $rootScope.submitOrder();
       
          }
          
        }
      };
      
        var list = OrderList.init();
      list.$watch(function(event) {
        
        if($state.current.name != "app.order.music" && $rootScope.setting.play === true && event.event === "child_added"){
          var obj = list.$getRecord(event.key);
          if(obj.done === 'Order'){
              $state.go("app.order.music");
              
            } 
        }
        
      });
     
       $rootScope.order = list;
        
        $rootScope.clearTime = function(){
          var time = Time.obj;
          time.$remove(function(ref){}); 
        }

        
        $rootScope.addTime = function(plusHrs, minPeriod, countPeriod, dayCount){
          
          var timeArray = TimeFactory.timeSelect;
          var i;
          var j;
          var d = new Date();
          d.setMinutes(0);
          var initMs = d.getTime();
          for(j=0; j<=dayCount; j++){
            for(i=0; i<=countPeriod; i++){
              var ms = initMs + i*minPeriod*60*1000+(plusHrs*60*60*1000) + j*24*60*60*1000;
              timeArray.$add({ms: ms});
            }
          }  
          
        };
      
      
      
      $rootScope.userInfo2 = {phone:''};


    

  
  $rootScope.prepared = function(index, order){
    
      var key = $rootScope.order.$keyAt(index);

      if(order.done == "Order"){
        
        order.done = "Preparing";
        if(order.status === 'Authorized'){
          SettleFactory.settle(key, order.transactionId);
        }
        
        $rootScope.order.$save(order);
       
       
      }
      else if(order.done == "Preparing"){
        
        order.done = "Ready";
        $rootScope.order.$save(order);
       
       
      }
      else if(order.done == "Ready"){

        order.done = "Picked-Up";
        $rootScope.order.$save(order);
      }
      else if(order.done == "Picked-Up"){

        order.done = "Cancel";
        $rootScope.order.$save(order);
      }
      else if(order.done == "Cancel"){

        order.done = "Order";
        $rootScope.order.$save(order);
      }
      
      
  };
  
  $rootScope.deductStock = function(stock){
      StockFactory.removeStock(stock);
  };

  $rootScope.deductOption = function(option){
    StockFactory.removeOption(option);
  };

  $rootScope.deductItem = function(item){
    StockFactory.removeItem(item);
  };
  
  $rootScope.content = {stock: '', price: 0};
  
  $rootScope.addStock = function(content){
     StockFactory.addStock($rootScope.content, function(data){
       $rootScope.content = data;
     });
  };
  
  $rootScope.option = {name: '', single: false};
  
  $rootScope.addOption = function(option, stock){
    StockFactory.addOption(option, stock, function(data){
      $rootScope.option = data;
    });
  };
  
  $rootScope.item = {name: '', price: 0, include: false};
  
   $rootScope.addItem = function(item, option){
  
    StockFactory.addItem(item, option, function(data){
      $rootScope.item = data;
    });
      
  };
  
  var obj = UserFactory.user(authData);
            obj.$loaded(function(data){
              if(data.authType === 'admin'){
                $state.go('app.order');
              } 
              else {
                $rootScope.someList = CustomFactory.custom(authData);
                $rootScope.someList.$loaded(function(data){
                  console.log('custom list length: ' + data.length);
                    if(data.length === 0){
                      $state.go('app.main.new');
                    } else {
                      $state.go('app.main');
                    }
                    
                });
                
              }
            }, function(error){});
  
  
  
}
          if(authData != null){
            
            loggedIn(authData);
            
          }
          else {
            
            $rootScope.auth.$authAnonymously().then(function(authData) {
              loggedIn(authData);
              console.log("Logged in as:", authData.uid);
              
            }).catch(function(error) {
              console.error("Authentication failed:", error);
            }); 

          }
        });
        
    
        $rootScope.userInfoLogin = {email: '', password: ''};
        $rootScope.login = function(){
          $rootScope.auth.$authWithPassword({email: $rootScope.userInfoLogin.email, password: $rootScope.userInfoLogin.password}).then(function(authData) {
            $rootScope.userInfoLogin.email = '';
            $rootScope.userInfoLogin.password = '';
            
          }).catch(function(error) {});
        };
        
      } 
    });
  });
});

//config

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('login', {    
    url: "/login",
    templateUrl: "templates/admin/login.html"
    })


  .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html'

  })

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html'
      }
    }
  })
  
  .state('app.main.setting', {
    url: '/setting',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/setting.html'
      }
    }
  })
  
  .state('app.main.confirm', {
    url: '/confirm',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/confirm.html'

       
      }
    }
  })
  
  .state('app.main.confirm.verify', {
    url: '/verify',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/verify.html'
      }
    }
  })
  
  
   .state('app.main.confirm.time', {
    url: '/time',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/time.html'
      }
    }
  })
  
   .state('app.main.prepare', {
    url: '/prepare',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/prepare.html'
      }
    }
  })
  
  .state('app.main.prepare.cannot', {
    url: '/cannot',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/cannot.html'
      }
    }
  })
  
  .state('app.main.prepare.confirmcancel', {
    url: '/confirmcancel',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/confirmcancel.html'
      }
    }
  })
  
  
  .state('app.main.new.save', {
    url: '/save',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/save.html'
      }
    }
  })
  
  .state('app.main.modify', {
    url: '/modify',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/modify.html'
      }
    }
  })
  

  
  .state('app.main.new.save.name', {
    url: '/name',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/name.html'
      }
    }
  })
  
  
  .state('app.main.new', {
    url: '/new',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/new.html'
      }
    }
  })
  
   .state('app.main.content', {
    url: '/content',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/content.html'
      }
    }
  })
  
  .state('app.main.confirm.reference', {
    url: '/reference',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/reference.html'
      }
    }
  })
  
  .state('app.main.prepare.contentOrder', {
    url: '/contentOrder',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/contentOrder.html'
      }
    
    }
  })
  
  
  .state('app.main.confirm.confirmsubmit', {
    url: '/confirmsubmit',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/confirmsubmit.html'
      }
    }
  })
  

  
  .state('app2', {
    url: '/app2',

    templateUrl: 'templates/admin/menu.html'

  })
  
  .state('app.order.set.stock', {
    url: '/stock',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/stock.html'
      }
    }
  })
  
  
  .state('app.order', {
    url: '/order',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/order.html'
      }
    }
  })
  
  .state('app.order.set.signup', {
    url: '/signup',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/signup.html'
      }
    }
  })
  
  .state('app.order.set.done', {
    url: '/done',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/done.html'
      }
    }
  })
  
  .state('app.order.music', {
    url: '/music',
    views: {
     'menuContent@app':{
       templateUrl: 'templates/admin/music.html'
     }
    }

  })
  
  .state('app.order.set.newtime', {
    url: '/newtime',
    views: {
      'menuContent@app':{
        templateUrl: 'templates/admin/newtime.html'
      }
    }
  })
  
  .state('app.order.set.version', {
    url: '/version',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/version.html'
      }
    }
  })
  
  .state('app.order.set', {
    url: '/set',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/admin/set.html'
      }
    }
  })
  
  .state('app.main.confirm.closed', {
    url: '/closed',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/closed.html'
      }
    }
  })

  
})

//fac

app.factory('Fire', function($state, $firebaseObject){
  var self = this;
  self.ver = 'v003';
  self.obj = new Firebase("https://popping-heat-6081.firebaseio.com/");
  self.connect = $firebaseObject(self.obj.child(".info").child("connected"));
  self.ref = self.obj.child("kingmilkbar").child(self.ver);
  return this;
});

app.factory('OrderList', function(Fire, $firebaseArray){
     var self = this;
     self.obj = null;
     self.init = function(){
       self.obj = $firebaseArray(Fire.ref.child("order"));
       
       return self.obj;
     };
     self.init();
     
     
     
     return self;
});

app.factory('SupportFactory', function(Fire, $firebaseObject){
  var self = this;
  
  self.obj = $firebaseObject(Fire.ref.child("support"));
  self.removeSupport = function(ver){
    self.obj.status = false;
    self.obj.$save();
  };
  self.giveSupport = function(ver){
    self.obj.status = true;
    self.obj.$save();
  }
  return self;
});

app.factory('NavigateFactory', function NavigateFactory($state){
  var self = this;
  self.parentGo = function(){
    $state.go('^');
  }
  return self;
});


app.factory('AuthFactory', function(Fire, $firebaseAuth){
    var self = this;
    self.auth = $firebaseAuth(Fire.ref);
    return self;
});

app.factory('UserFactory', function(Fire, $firebaseObject){
    var self = this;
    self.user = function(authData){
      return $firebaseObject(Fire.ref.child("users").child(authData.uid));
    }
    self.newReference = function(authData, reference){
      var obj = $firebaseObject(Fire.ref.child("users").child(authData.uid).child("profile"));
      obj.reference = reference;
      obj.$save();
    }

    
    return self;
});


app.factory('OrderFactory', function($state, Fire, $firebaseArray, $firebaseObject, UserFactory, CustomFactory){
  var self = this;
  self.order = {};
  self.init = function(authData, callback){
    var user = UserFactory.user(authData);
    user.$loaded(function(data){
      var list = CustomFactory.custom(authData);
      list.$loaded(function(x){
          
          var reference = "";
          if(data.profile != null) {
            if(data.profile.reference != null){
              reference = data.profile.reference;
            }
          }
          self.order = {method: 'In-store', total: 0, ms: 9999999999999, mobile: '', order: 0, reference: 'test' , done: "Order", user: authData.uid, customList: angular.copy(x)};
          return callback(self.order);
      });
    });
  }
  self.grandTotal = function(){
    self.order.total = 0;
    angular.forEach(self.order.customList, function(value, key){
      self.order.total = self.order.total + value.qty * value.total;
      self.order.total = Math.round(self.order.total * 100)/100;
    });
  }
  
  self.add = function(stock, custom, user){
    stock.custom = custom;
    stock.user = user;
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
      qty: 0
    });
  }
  self.submit = function(orderCopy){
    
 
      var order = $firebaseArray(Fire.ref.child("order").limitToFirst(1));
      orderCopy.order = Firebase.ServerValue.TIMESTAMP;
      orderCopy.status = 'NA';
      order.$add(orderCopy).then(function(ref){
      });
     
}

  self.remove = function(key){
    var obj = $firebaseObject(Fire.ref.child("order").child(key));
    obj.$remove();
  };
  
  self.userOrdersList = null;
  
  self.userOrders = function(authData){
    self.userOrdersList = $firebaseArray(Fire.ref.child("order").orderByChild("user").equalTo(authData.uid));
    return self.userOrdersList;
  };
  
  
  
  self.modify = function(newId){
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

  
  return self
});

app.factory('CustomFactory', function(Fire, $firebaseArray, $firebaseObject){
  var self = this;
  self.obj = null;
  self.init = function(customId){
    self.obj = $firebaseObject(Fire.ref.child("custom").child(customId));
    return self.obj;
  };
  self.customList = null;
  self.custom = function(authData){
    self.customList = $firebaseArray(Fire.ref.child("custom").orderByChild("user").equalTo(authData.uid));
    return self.customList;
  }
  self.modify = function(newId){
    var list = self.customList;
    var index = 0;
    angular.forEach(list, function(value, key){
      list[index].user = newId;
      list.$save(index);
      index++;
    })
  }
  
   self.total = function(){
    self.obj.total = self.obj.price;
    angular.forEach(self.obj.option, function(value, key){
      angular.forEach(value.item, function(value, key){
        if(value.include === true){
          self.obj.total = Math.round((self.obj.total + value.price) * 100)/100;
        }
      })
    })
  }
  self.adjustName = function(newName){
    self.obj.custom = newName;
    self.obj.$save();
  }
  self.priceAdjust = function(item){
    
    console.log('custom price adjust fire');
    var cusItem = self.obj.option[item.optionId].item[item.itemId];
    var option = self.obj.option[item.optionId];
    var itemArray = option.item;
    if(option.single === true){
      angular.forEach(itemArray, function(value, key){
        if(value.itemId === item.itemId){
          value.include = true;
          console.log('custom price true');
          
        } else {
          value.include = false;
          console.log('custom price false');
        }
        
      });
    } else {
      cusItem.include = item.include;
    }
    
    self.total();
    self.obj.$save();
  }
  self.add = function(stock, custom, user, callback){
    stock.custom = custom;
    stock.user = user;
    var push = Fire.ref.child("custom").push();
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
      qty: 0
        
    }, function(ref){
        callback(ref);
    });
  }
  self.remove = function(stock){
    var obj = $firebaseObject(Fire.ref.child("custom").orderByChild("customId").equalTo(stock.customId));
      obj.$remove().then(function(ref){});
  }
  return self;
});

app.factory('StockFactory', function(OrderFactory, CustomFactory, Fire, $firebaseArray, $firebaseObject){
  var self = this;
  self.stock = null;
  self.item = null;
  self.obj = $firebaseArray(Fire.ref.child("stock"));
  self.removeStock = function(stock){
    self.obj.$remove(stock);
  };
  self.removeOption = function(option){
    var obj = $firebaseObject(Fire.ref.child("stock").child(option.stockId).child("option").child(option.optionId));
    obj.$remove();
  }
  self.removeItem = function(item){
    var obj = $firebaseObject(Fire.ref.child("stock").child(item.stockId).child("option").child(item.optionId).child("item").child(item.itemId));
    obj.$remove();
  }

  self.stockCopy = function(stock){
    self.stock = angular.copy(stock);
    return self.stock;
  };

  self.total = function(){
    self.stock.total = self.stock.price;
    angular.forEach(self.stock.option, function(value, key){
      angular.forEach(value.item, function(value, key){
        if(value.include === true){
          self.stock.total = Math.round((self.stock.total + value.price) * 100)/100;
        }
      })
    })
  }

  
  self.priceAdjust = function(stock, item){
    
    self.stock = stock;
    self.item = item;
    var option = self.stock.option[self.item.optionId];
    var itemArray = option.item;
    if(option.single === true){
      angular.forEach(itemArray, function(value, key){
        if(value.itemId === item.itemId){
          value.include = true;
          
        } else {
          value.include = false;
        }
        
      });
    }
    
    self.total();
    OrderFactory.grandTotal();
    //CustomFactory.obj.$save();
  }
  
  self.addStock = function(content, callback){
    var push = Fire.ref.child("stock").push()
      push.set({
        "stockId": push.key(),
        "stock":content.stock,
        "custom": '',
        "price":content.price,
        "total": 0,
        "order": Firebase.ServerValue.TIMESTAMP
      }, function(ref){
        callback({stock: '', price: 0})
      });
  };
  self.addOption = function(option, stock, callback){
    var key = stock.stockId;
    var push = Fire.ref.child("stock").child(key).child("option").push();
    push.set({
      "optionId": push.key(),
      "stockId": stock.stockId,   
      "name": option.name,
      "single": option.single
    }, function(ref){});
      callback({name: '', single: false});
  };
  self.addItem = function(item, option, callback){
     var push = Fire.ref.child("stock").child(option.stockId).child("option").child(option.optionId).child("item").push();
    
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
      "include": validate()
    }, function(ref){
      callback({name: '', price: 0, include: false})
    });
  };
  return self;
});


app.factory('Hour', function(Fire, $firebaseObject){
  var self = this;
  self.obj = $firebaseObject(Fire.ref.child('hour'));
  return this;
});

app.factory('Time', function(Fire, $firebaseObject){
  var self = this;
  self.obj = $firebaseObject(Fire.ref.child("time"));
  return self;
});

app.factory('TimeFactory', function(Fire, $firebaseArray, $interval){
  var self = this;
  self.currentTime = new Date().getTime();
  self.timeSelect = $firebaseArray(Fire.ref.child("time").orderByChild("ms").startAt(self.currentTime).limitToFirst(24));
  self.order = null;
  self.interval = function(callback){
      if(self.order != null) {
        self.currentTime = new Date().getTime();
        callback(self.currentTime);
        if(self.currentTime > self.order.ms){
          var found = false;
          angular.forEach(self.timeSelect, function(value, key){
            if(value.ms > self.currentTime && found === false){
              self.order.ms = value.ms;
              found = true;
            }
          });
        }
      }
  }
  return self;
});

//end




