// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','chart.js'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($ionicConfigProvider) {
$ionicConfigProvider.tabs.position('bottom');
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'TabCtrl'

  })

    .state('login', {
    url: "/login",
    abstract: false,
    templateUrl: "templates/login.html",
    controller: 'UsersCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/charts',
    views: {
      'tab-dash': {
        templateUrl: 'templates/chartmenus.html',
        controller: 'GraphCtrl'
      }
    }
  })

  .state('tab.dash.chart2', {
    url: '/plannedVSactual',
    views: {
      'menuContent': {
        templateUrl: 'templates/plannedvsactualbudget.html',
        controller: 'GraphCtrl'
      }
    }
  })

  .state('tab.dash.expensesbycategory', {
    url: '/expensesbycategory',
    views: {
      'menuContent': {
        templateUrl: 'templates/expenses-by-category.html',
        controller: 'GraphCtrl'
      }
    }
  })

.state('tab.projects', {
      url: '/projects',
      views: {
        'tab-projects': {
          templateUrl: 'templates/projects.html',
          controller: 'ProjectCtrl'
        }
      }
    })

   .state('tab.project-task', {
      url: '/projects/:projectId',
      views: {
        'tab-projects': {
          templateUrl: 'templates/tasks.html',
          controller: 'TasksCtrl'
        }
      }
    })

   .state('tab.project-task-expense', {
      url: '/expenses/:taskId/:projectId',
      views: {
        'tab-projects': {
          templateUrl: 'templates/expenses.html',
          controller: 'ExpensesCtrl'
        }
      }
    })

    .state('tab.project-task-addexpense', {
    url: '/addExpense/:taskId/:projectId',
    views: {
      'tab-projects': {
        templateUrl: 'templates/add-expense.html',
        controller: 'ExpensesCtrl'
      }
    }
  })
    
  .state('tab.project-task-viewexpense', {
    url: '/expenses/:taskId/:expenseId',
    views: {
      'tab-projects': {
        templateUrl: 'templates/view-expense.html',
        controller: 'ExpensesCtrl'
      }
    }
  })



   .state('tab.project-edit', {
      url: '/projects/edit/:projectId',
      views: {
        'tab-projects': {
          templateUrl: 'templates/projectEdit.html',
          controller: 'ProjectCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/adminMenus.html'
      }
    }
  })

  .state('tab.account.addProject', {
    url: '/addProject',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-project.html',
        controller: 'ProjectCtrl'
      }
    }
  })

  .state('tab.account.editProjects', {
    url: '/editProjects',
    views: {
      'menuContent': {
        templateUrl: 'templates/editprojects.html',
        controller: 'ProjectCtrl'
      }
    }
  })

  .state('tab.account.editProject', {
    url: '/editProjects/:projectId',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit-project.html',
        controller: 'ProjectCtrl'
      }
    }
  })

  .state('tab.account.editTasks', {
    url: '/editTasks/:projectId',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit-tasks.html',
        controller: 'TasksCtrl'
      }
    }
  })


  .state('tab.account.addtask', {
    url: '/addTask/:projectId',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-task.html',
        controller: 'TasksCtrl'
      }
    }
  })

  .state('tab.account.edittask', {
    url: '/editTask/:taskId/:projectId',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit-task.html',
        controller: 'TasksCtrl'
      }
    }
  })

  .state('tab.account.addUser', {
    url: '/addUser',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-user.html',
        controller: 'UsersCtrl'
      }
    }
  })

  .state('tab.account.editUsers', {
    url: '/editUsers',
    views: {
      'menuContent': {
        templateUrl: 'templates/editusers.html',
        controller: 'UsersCtrl'
      }
    }
  })

  .state('tab.account.editUser', {
    url: '/editUsers/:userId',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit-user.html',
        controller: 'UsersCtrl'
      }
    }
  })

  .state('tab.account.addAdvance', {
    url: '/addAdvance',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-advances.html',
        controller: 'AdvancesCtrl'
      }
    }
  })

  .state('tab.account.advances', {
    url: '/advances',
    views: {
      'menuContent': {
        templateUrl: 'templates/advances.html',
        controller: 'AdvancesCtrl'
      }
    }
  })



  


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});


