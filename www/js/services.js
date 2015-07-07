var pmtApp=angular.module('starter.services', []);
var url = 'https://fast-brook-9774.herokuapp.com/';

pmtApp.service('projectsFactory',['$http', function($http) {
  var projects ={};
  var tasks={};
  var expenses={};

  var employees=$http.get(url + 'Employees').
        success(function(data) {
            return data;
        });


  return {
    getProjects: function() {
      projects = $http.get(url + 'projects').
        success(function(data) {
            return data;
        });

      return projects;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    getProject: function(projectId) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === parseInt(projectId)) {
          return projects[i];
        }
      }
      return null;
    },
    getTasks: function(projectId) {
      tasks = $http.get(url + 'projects/'+ projectId).
        success(function(data) {
            return data;
    });
      return tasks;
  },
  getExpenses: function(taskId) {
      expenses = $http.get(url + 'tasks/'+ taskId).
        success(function(data) {
            return data;
    });
      return expenses;
  },
  getEmployees: function() {
    return employees;
    },
    
  addProject: function(projectData) {
    var res = $http.post(url + 'projects',projectData).
        success(function(data) {
            return data;
    });
      return res;
    

    },
  
 editProject: function(projectData) {
    var res = $http.put(url + 'projects/' + projectData._id+"/update",projectData).
        success(function(data) {
            return data;
    });
      return res;
    

    },

 deleteProject: function(projectId) {
    var res = $http.delete(url + 'projects/' + projectId+"/delete").
        success(function() {
            return "";
    });
      return res;
    },

 addTask: function(projectId,taskData) {
    var res = $http.post(url + 'projects/'+projectId+'/tasks' ,taskData).
        success(function(data) {
            return data;
    });
      return res;
    

    },
  
 editTask: function(taskData) {
    var res = $http.put(url + 'tasks/' + taskData._id+"/update",taskData).
        success(function(data) {
            return data;
    });
      return res;
    

    },

 deleteTask: function(taskId) {
    var res = $http.delete(url + 'tasks/' + taskId+"/delete").
        success(function() {
            return "";
    });
      return res;
    },

 addExpense: function(taskId,expenseData) {
    var res = $http.post(url + 'tasks/'+taskId+'/taskbreakup' ,expenseData).
        success(function(data) {
            return data;
    });
      return res;
    

    },

    deleteExpense: function(expenseId) {
    var res = $http.delete(url + 'expenses/' + expenseId+"/delete").
        success(function() {
            return "";
    });
      return res;
    },
 

  };
}]);

pmtApp.factory('MenuService', function() {
  var menuItems = [{text: 'Friends'}, {text: 'Enemies'}, {text: 'Losers'}];

  return {
    all: function() {
      return menuItems;
    }
  }
});


pmtApp.factory('chartsFactory',['$http', function($http) {
   return {
    getPlannedExpensesByProject: function() {
      return projects = $http.get(url + 'plannedexpenses/groupbyproject').
        success(function(data) {
            return data;
        });

    },
    getActualExpensesByProject: function() {
      return projects = $http.get(url + 'totalexpenses/groupbyproject').
        success(function(data) {
            return data;
        });

    },
    getTotalExpensesByProjectAndCategory: function() {
      return projects = $http.get(url + 'totalexpenses/groupbyprojectandcategory').
        success(function(data) {
            return data;
        });

    },
    getTotalExpensesByCategory: function() {
      return projects = $http.get(url + 'totalexpenses/groupbycategory').
        success(function(data) {
            return data;
        });

    },
    getTotalExpensesByTask: function() {
      return projects = $http.get(url + 'totalexpenses/groupbytask').
        success(function(data) {
            return data;
        });

    }
  };
}]);


pmtApp.factory('usersFactory',['$http', function($http) {
   return {

    getEmployees: function() {
    return $http.get(url + 'Employees').
        success(function(data) {
            return data;
        });
    },
    getEmployeeProjects: function(empId) {
    return $http.get(url + 'user/projects/'+empId).
        success(function(data) {
            return data;
        });
    },
    getLoginDetails: function(username,password) {
      return projects = $http.get(url + 'login/' + username + "/" + password).
        success(function(data) {
            return data;
        });

    },
    addUser: function(userData) {
    var res = $http.post(url + 'employees',userData).
        success(function(data) {
            return data;
    });
      return res;
    

    },
  
 editUser: function(userData) {
  console.log(userData);
    var res = $http.put(url + 'employees/' + userData._id+"/update",userData).
        success(function(data) {
            return data;
    });
      return res;
    

    },

 deleteUser: function(userId) {
    var res = $http.delete(url + 'employees/' + userId+"/delete").
        success(function() {
            return "";
    });
      return res;
    },
  };
}]);

pmtApp.factory('advancesFactory',['$http', function($http) {
   return {

    getAdvances: function() {
    return $http.get(url + 'advances').
        success(function(data) {
            return data;
        });
    },
    
    addAdvance: function(advanceData) {
    var res = $http.post(url + 'advances',advanceData).
        success(function(data) {
            return data;
    });
      return res;
    

    },
  
 
  };
}]);



pmtApp.factory('scopesFactory', function ($rootScope) {
    var mem = {};

    return {
        store: function (key, value) {
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});

