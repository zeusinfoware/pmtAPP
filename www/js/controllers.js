angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('AppCtrl', ['$scope', function($scope) {
  $scope.$back = function() { 
    window.history.back();
  };
}])

.controller('MenuController', function ($scope, $location, MenuService) {
  // "MenuService" is a service returning mock data (services.js)
  $scope.list = MenuService.all();
})

.controller('GraphCtrl', function($scope,projectsFactory,chartsFactory,scopesFactory,$location) { // Add a simple controller
  $scope.graph = {};                        // Empty graph object to hold the details for this graph
  $scope.graph.data = [                     // Add bar data, this will set your bars height in the graph
    //Awake
    [163434, 152332, 20343],
    //Asleep
    [8234, 9343, 434343]
  ];
  
  $scope.projects = {};
  $scope.selectedProject = {};
  $scope.selectedProject.project ="";

  
  var loggedInUser = scopesFactory.get("loggedinuser");
  if(loggedInUser==undefined || loggedInUser=="" || loggedInUser==null || loggedInUser.empType!=2)
  {
    $location.path("/login");
  }
  else
  {
    scopesFactory.store("loggedinuser",loggedInUser);
  }

  $scope.accountVisible=true;
  $scope.tab="tab";
  if(loggedInUser.empType!=2)
  {
    $scope.accountVisible=false;
    $scope.tab ="usertab";
  }
  




  getProjects();

    function getProjects() {
        projectsFactory.getProjects()
            .success(function (projects) {
                $scope.projects = projects;
                
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

    function getPlannedExpensesByProject()
    {
          chartsFactory.getPlannedExpensesByProject()
            .success(function (data) {
                $scope.plannedBudjectsFromService = data;
                getActualExpensesByProject();
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });


    }

    function getActualExpensesByProject()
    {
       chartsFactory.getActualExpensesByProject()
            .success(function (data) {
                $scope.actualBudjectsFromService = data;
                updatePlannedVsActual();
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });

    }

    function updatePlannedVsActual()
    {
      var plannedBudjectsFromService=$scope.plannedBudjectsFromService;
      var actualBudjectsFromService=$scope.actualBudjectsFromService;
      var plannedBudjects=[];
      var actualBudjects=[];
      var chartLabels=[];
      

     for (var i = 0; i < $scope.projects.length; i++) {
          chartLabels.push($scope.projects[i].name);
          var found=0;
          for(var j=0;j<plannedBudjectsFromService.length;j++)
          {
            if($scope.projects[i]._id == plannedBudjectsFromService[j]._id)
            {

              plannedBudjects.push(plannedBudjectsFromService[j].budget);
              found=1;
              break;

            }
          }
          if(found==0)
          {
            plannedBudjects.push(0);
          }
          found=0;

          for(var j=0;j<actualBudjectsFromService.length;j++)
          {
            if($scope.projects[i]._id == actualBudjectsFromService[j]._id.projectId)
            {
              //console.log(actualBudjectsFromService[j]._id.projectId);
              actualBudjects.push(actualBudjectsFromService[j].expense);
              found=1;
              break;

            }
          }
          if(found==0)
          {
            actualBudjects.push(0);
          }
        
        }
        $scope.graph.labels = chartLabels;
        $scope.graph.series = ['Planned', 'Actual'];  // Add information for the hover/touch effect
        var finalData=[];
        finalData.push(plannedBudjects);
        finalData.push(actualBudjects);
        $scope.graph.data = finalData;
        //console.log(finalData);

    }

    $scope.getPlannedVsActual = function()
    {
      $scope.type = 'Bar';
      getPlannedExpensesByProject();

    };

    $scope.getExpensesByCategory = function()
    {
      $scope.type = 'Pie';
      getExpensesByProject();

    };

    function getExpensesByProject()
    {
          chartsFactory.getTotalExpensesByProjectAndCategory()
            .success(function (data) {
                $scope.ExpensesByCategoryAllProjects = data;
                getExpensesByProjectAndCategory();
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
    }

    function getExpensesByProjectAndCategory()
    {

        var finalData=[];
        var chartLabels=[];
        var projectId=$scope.selectedProject.project;
        var isFound = false;
        if(projectId!=undefined)
          projectId=projectId._id;

        $scope.graph.labels1 = [];
        $scope.graph.data1 = [];
        if(projectId==undefined || projectId=="" || projectId==null)
        {
          if($scope.projects[0]!=undefined)
          {
            projectId = $scope.projects[0]._id;
            $scope.selectedProject.project = $scope.projects[0];
          }

        }
        if(projectId!=undefined)
        {

          for(var i=0;i<$scope.ExpensesByCategoryAllProjects.length;i++)
          {
            if($scope.ExpensesByCategoryAllProjects[i]._id.projectId == projectId)
            {
              chartLabels.push($scope.ExpensesByCategoryAllProjects[i]._id.expenseCategory);
              finalData.push($scope.ExpensesByCategoryAllProjects[i].expense);
              isFound=true;

            }
          }
        }
        if(isFound===false)
        {
          finalData=[0];
          chartLabels=['No Expenses'];
        }

        $scope.graph.labels1 = chartLabels;
        $scope.graph.data1 = finalData;
        

    }


})

.controller('UsersCtrl', function($scope, $stateParams,usersFactory,$filter,$ionicPopup,$location,scopesFactory) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
   $scope.loginParams=[];
   $scope.loginParams.username="";
   $scope.loginParams.password="";

   if(window.localStorage.getItem("username") !== undefined && window.localStorage.getItem("password") !== undefined) {
        $scope.loginParams.username=window.localStorage.getItem("username");
        $scope.loginParams.password=window.localStorage.getItem("password");
           
        } 

  
  $scope.login = function() {

    usersFactory.getLoginDetails($scope.loginParams.username,$scope.loginParams.password)
            .success(function (userInfo) {
                $scope.userInfo = userInfo;

                if(userInfo==undefined || userInfo=="" || userInfo==null)
                {
                  $scope.showAlert("Invalid Login Credentials");
                  return;
                }
                else
                {
                  window.localStorage.setItem("username", $scope.loginParams.username);
                  window.localStorage.setItem("password", $scope.loginParams.password);
                  scopesFactory.store("loggedinuser",userInfo[0]);
                  
                  if(userInfo[0].empType==2)
                  {
                    console.log(userInfo[0].empType);
                   $location.path('tab/charts/plannedVSactual');
                   $scope.accountVisible = true;
                   console.log(userInfo[0].empType);
                  }
                  else
                  {
                    console.log(userInfo[0].empType);
                    $location.path('tab/projects');
                  }
                }
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    
  };

   $scope.showAlert = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: 'Projects',
       template: message
     });
     alertPopup.then(function(res) {
       //console.log('Thank you for not eating my delicious ice cream cone');
     });
   };


    $scope.employees = {};

    $scope.employee = {};
    $scope.employee.name ="";
    $scope.employee.address ="";
    $scope.employee.empType ="";
    $scope.employee.emailId ="";
    $scope.employee.phone ="";
    $scope.employee.username ="";
    $scope.employee.password ="";

    

    $scope.employees = {};
    getEmployees();
    function getEmployees() {
        usersFactory.getEmployees()
            .success(function (employees) {
                $scope.employees = employees;
                 if($stateParams.userId!=null && $stateParams.userId!="" && $stateParams.userId!=undefined)
                {
                  getUser($stateParams.userId);
                }
            })
            .error(function (error) {
                $scope.status = 'Unable to load tasks data: ' + error.message;
            });
    }

    $scope.reset = function() {
         $scope.employee.name ="";
          $scope.employee.address ="";
          $scope.employee.empType ="";
          $scope.employee.emailId ="";
          $scope.employee.phone ="";
          $scope.employee.username ="";
          $scope.employee.password ="";
      };

      
    
   
    $scope.submit = function(){
      $scope.addEmployee();
    };

    $scope.submitedit = function(){
      $scope.editEmployee();
    };


     $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete User',
       template: 'Are you sure you want to delete this user?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $scope.remove($scope.employee._id);
       } else {
         //console.log('You are not sure');
       }
     });
   };


    $scope.addEmployee = function(){
      console.log($scope.employee.name);
      if($scope.employee.name=="" || $scope.employee.empType=="" || $scope.employee.phone =="" || $scope.employee.username =="" || $scope.employee.password=="" )
      {
        $scope.showAlert("Please enter all the user information.");
        return;
      }
      var employeeObj = {
        empId:"",
        name: $scope.employee.name,
        address: $scope.employee.address,
        phone: $scope.employee.phone,
        gender: "Male",
        dob: "",
        joinDate:"",
        username: $scope.employee.username,
        password: $scope.employee.password,
        emailId: $scope.employee.emailId,
        empType: $scope.employee.empType,
        status:1,
      };
      usersFactory.addUser(employeeObj)
            .success(function (data) {
                $scope.responseMessage ="User Added Successfully";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "balanced";
                $scope.employee.name = "";
                $scope.employee.address = "";
                $scope.employee.phone = "";
                $scope.employee.username = "";
                $scope.employee.password = "";
                $scope.employee.emailId = "";
                $scope.employee.empType = "";
                $location.path('/tab/account/editUsers');
                //$scope.projects.push(data.data);
                //projectsFactory.projects.push(data);
                //$scope.projects= data.data;
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
      
    };

    $scope.editEmployee = function(){
      var employeeObj = {
        empId:"",
        _id:$scope.employee._id,
        name: $scope.employee.name,
        address: $scope.employee.address,
        phone: $scope.employee.phone,
        gender: "Male",
        dob: "",
        joinDate:"",
        username: $scope.employee.username,
        emailId: $scope.employee.emailId,
        empType: $scope.employee.empType,
        status:1,
      };
        usersFactory.editUser(employeeObj)
            .success(function (data) {
                $scope.responseMessage ="User modified Successfully";
                $scope.showAlert($scope.responseMessage);
                $location.path('/tab/account/editUsers');
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
      
    };


    function getUser(userId)
    {
     for (var i = 0; i < $scope.employees.length; i++) {
        if ($scope.employees[i]._id === userId) {
          $scope.employee._id = userId;
          $scope.employee.name = $scope.employees[i].name;
          $scope.employee.address = $scope.employees[i].address;
          $scope.employee.phone = $scope.employees[i].phone;
          $scope.employee.username = $scope.employees[i].username;
          $scope.employee.emailId = $scope.employees[i].emailId;
          $scope.employee.empType = $scope.employees[i].empType;
        }
      }
      return "";
    };

    
  $scope.remove = function(userId) {
    usersFactory.deleteUser(userId)
            .success(function () {
                $scope.responseMessage ="Deleted Successfully";
                $scope.showAlert($scope.responseMessage);
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
            $location.path('/tab/account/editUsers');

  };


})

.controller('ProjectCtrl', function($scope,$stateParams, projectsFactory,$filter,$ionicPopup,$location,scopesFactory,usersFactory,$state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  var loggedInUser = scopesFactory.get("loggedinuser");
  
  $scope.accountVisible=true;
  if(loggedInUser==undefined || loggedInUser=="" || loggedInUser==null )
  {
    $location.path("/login");
  }
  else
  {
    scopesFactory.store("loggedinuser",loggedInUser);
  }

  $scope.tab ="tab";
  $scope.empType=loggedInUser.empType;
  if(loggedInUser.empType!=2)
  {
    $scope.accountVisible=false;
    $scope.tab ="usertab";
  }


  
    $scope.projects = {};

    $scope.project = {};
    $scope.project.name ="";
    $scope.project.description ="";
    $scope.project.type ="";
    $scope.project.budget ="";
    $scope.project.startdate ="";
    $scope.project.enddate ="";

    $scope.reset = function() {
         $scope.project.name ="";
        $scope.project.description ="";
        $scope.project.type ="";
        $scope.project.budget ="";
        $scope.project.startdate ="";
        $scope.project.enddate ="";
      };

    $scope.loadProjects = function()
    {
      console.log("Hello, I'm called");
      getProjects();      
    }

    

    getProjects()
    function getProjects() {
        projectsFactory.getProjects()
            .success(function (projects) {
                if(loggedInUser.empType==2)           
                {
                  $scope.projects = projects;
                }
                else
                {
                  $scope.projects=[];
                  usersFactory.getEmployeeProjects(loggedInUser._id)
                    .success(function (empProjects) {

                  for(var i=0;i<empProjects.length;i++)
                  {
                        var found =false;
                            for(var k=0;k<$scope.projects.length;k++)
                            {
                              if($scope.projects[k]._id == empP[i].project)
                              {
                                found =true;
                                break;
                              }

                            }
                            if(found ==false)
                            {

                              for(var j=0;j<projects.length;j++)
                                {
                                  if(projects[j]._id == empProjects[i].project)
                                  {
                                    $scope.projects.push(projects[j]);

                                  }

                                }

                            }
                  }
                        
                    })
                    .error(function (error) {
                        $scope.status = 'Unable to load tasks data: ' + error.message;
                    });


                }

                if($stateParams.projectId!=null && $stateParams.projectId!="" && $stateParams.projectId!=undefined)
                {
                  getProject($stateParams.projectId);
                }
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

  

    $scope.submit = function(){
      $scope.addProject();
    };

    $scope.submitedit = function(){
      $scope.editProject();
    };


     $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Project',
       template: 'Are you sure you want to delete this project?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $scope.remove($scope.project._id);
       } else {
         //console.log('You are not sure');
       }
     });
   };


    $scope.addProject = function(){
      if($scope.project.name=="" || $scope.project.description=="" || $scope.project.type =="" || $scope.project.budget =="" || $scope.project.startdate=="" || $scope.project.enddate=="")
      {
        $scope.showAlert("Please enter all the project information.");
        return;
      }
      var projectObj = {
        name: $scope.project.name,
        description: $scope.project.description,
        type: $scope.project.type,
        budget: $scope.project.budget,
        startDate: $scope.project.startdate,
        endDate: $scope.project.enddate,
      };
      projectsFactory.addProject(projectObj)
            .success(function (data) {
                $scope.responseMessage ="Project Added Successfully";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "balanced"
                $scope.project.name ="";
                $scope.project.description ="";
                $scope.project.type ="";
                $scope.project.budget ="";
                $scope.project.startdate ="";
                $scope.project.enddate =""; 
                $location.path('/tab/account/editProjects');         
                //$scope.projects.push(data.data);
                //projectsFactory.projects.push(data);
                //$scope.projects= data.data;
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
      
    };

    $scope.editProject = function(){
      var projectObj = {
        _id: $scope.project._id,
        name: $scope.project.name,
        description: $scope.project.description,
        type: $scope.project.type,
        budget: $scope.project.budget,
        startDate: $scope.project.startdate,
        endDate: $scope.project.enddate,
      };
        projectsFactory.editProject(projectObj)
            .success(function (data) {
                $scope.responseMessage ="Project modified Successfully";
                $scope.showAlert($scope.responseMessage);
                $location.path('/tab/account/editProjects');
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
      
    };


    function getProject(projectId)
    {
     for (var i = 0; i < $scope.projects.length; i++) {
        if ($scope.projects[i]._id === projectId) {
          $scope.project._id = projectId;
          $scope.project.name =$scope.projects[i].name;
          $scope.project.description =$scope.projects[i].description;
          $scope.project.type =$scope.projects[i].type;
          $scope.project.budget =$scope.projects[i].budget;
          var stDate = new Date($scope.projects[i].startDate)

          var stDate1 = stDate.getFullYear() + "/" + stDate.getMonth() + "/" + stDate.getDate();
          var etDate = new Date($scope.projects[i].endDate)
          var etDate1 = etDate.getFullYear() + "/" + etDate.getMonth() + "/" + etDate.getDate();
          $scope.project.startdate = new Date($scope.projects[i].startDate);
          $scope.project.enddate = new Date($scope.projects[i].endDate);
        }
      }
      return "";
    };

   $scope.showAlert = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: 'Projects',
       template: message
     });
     alertPopup.then(function(res) {
       //console.log('Thank you for not eating my delicious ice cream cone');
     });
   };

    
  $scope.remove = function(projectId) {
    projectsFactory.deleteProject(projectId)
            .success(function () {

                $scope.responseMessage ="Deleted Successfully";
                $scope.showAlert($scope.responseMessage);
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
              $state.go('tab.account.editProjects', {}, {reload: true});
            

  };


})

.controller('TasksCtrl', function($scope, $stateParams, projectsFactory,$ionicPopup,$location,scopesFactory) {

  var loggedInUser = scopesFactory.get("loggedinuser");
  $scope.accountVisible=true;
  if(loggedInUser==undefined || loggedInUser=="" || loggedInUser==null )
  {
    $location.path("/login");
  }
  else
  {
    scopesFactory.store("loggedinuser",loggedInUser);
  }

  $scope.tab ="tab";
  $scope.empType=loggedInUser.empType;
  if(loggedInUser.empType!=2)
  {
    $scope.accountVisible=false;
    $scope.tab ="usertab";
  }


    $scope.tasks = {};
    if($stateParams.projectId!=undefined && $stateParams.projectId!="" && $stateParams.projectId!=null)
    {
      $scope.projectId = $stateParams.projectId;
      getTasks($scope.projectId);

    }

    function getTasks(projectId) {
      //console.log(projectId);
        projectsFactory.getTasks(projectId)
            .success(function (tasks) {
                $scope.tasks = tasks;
                if(loggedInUser.empType==2)           
                {
                  $scope.tasks = tasks;
                }
                else
                {
                  var usertasks=[];
                  for(var i=0;i<tasks.tasks.length;i++)
                  {
                    if(tasks.tasks[i].assignedTo == loggedInUser._id)
                    {
                      usertasks.push(tasks.tasks[i]);
                    }

                  }
                  tasks.tasks = usertasks;
                  $scope.tasks = tasks;

                }

                if($stateParams.taskId!=null && $stateParams.taskId!="" && $stateParams.taskId!=undefined)
                {
                  getTask($stateParams.taskId);

                }
            })
            .error(function (error) {
                $scope.status = 'Unable to load tasks data: ' + error.message;
            });
    }

    $scope.employees = {};
    getEmployees();
    function getEmployees() {
        projectsFactory.getEmployees()
            .success(function (employees) {
                $scope.employees = employees;
            })
            .error(function (error) {
                $scope.status = 'Unable to load tasks data: ' + error.message;
            });
    }

    
    $scope.getEmployeeName = function(empId)
    {
     for (var i = 0; i < $scope.employees.length; i++) {
        if ($scope.employees[i]._id === empId) {
          return $scope.employees[i].name;
        }
      }
      return "";
    }

    
    $scope.task = {};
    $scope.task.name ="";
    $scope.task.description ="";
    $scope.task.assignedTo ="";
    $scope.task.budget ="";
    $scope.task.startdate ="";
    $scope.task.enddate ="";

    $scope.reset = function() {
        $scope.task.name ="";
        $scope.task.description ="";
        $scope.task.assignedTo ="";
        $scope.task.budget ="";
        $scope.task.startdate ="";
        $scope.task.enddate ="";  
      };

    $scope.submit = function(){
      $scope.addTask();
    };

    $scope.submitedit = function(){
      $scope.editTask();
    };


     $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Task',
       template: 'Are you sure you want to delete this task?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $scope.remove($scope.task._id);
       } else {
         //console.log('You are not sure');
       }
     });
   };


    $scope.addTask = function(){
       if($scope.task.name=="" || $scope.task.description=="" || $scope.task.assignedTo =="" || $scope.task.budget =="" || $scope.task.startdate=="" || $scope.task.enddate=="")
      {
        $scope.showAlert("Please enter all the task information.");
        return;
      }
      var taskObj = {
        name: $scope.task.name,
        description: $scope.task.description,
        assignedTo: $scope.task.assignedTo._id,
        budget: $scope.task.budget,
        startDate: $scope.task.startdate,
        endDate: $scope.task.enddate,
      };
      projectsFactory.addTask($scope.projectId,taskObj)
            .success(function (data) {
                $scope.responseMessage ="Task Added Successfully";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "balanced"
                $scope.task.name ="";
                $scope.task.description ="";
                $scope.task.assignedTo ="";
                $scope.task.budget ="";
                $scope.task.startdate ="";
                $scope.task.enddate ="";          
                $location.path('/tab/account/editTasks/'+$scope.projectId);
                //$scope.tasks.push(data.data);
                //projectsFactory.projects.push(data);
                //$scope.projects= data.data;
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
      
    };

    $scope.editTask = function(){
      var taskObj = {
        _id: $scope.task._id,
        name: $scope.task.name,
        description: $scope.task.description,
        assignedTo: $scope.task.assignedTo._id,
        budget: $scope.task.budget,
        startDate: $scope.task.startdate,
        endDate: $scope.task.enddate,
      };
      projectsFactory.editTask(taskObj)
            .success(function (data) {
                $scope.responseMessage ="Task modified Successfully";
                $scope.showAlert($scope.responseMessage);
                $location.path('/tab/account/editTasks/'+$scope.projectId);
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
      
    };


    function getTask(taskId)
    {
      var tasks = $scope.tasks.tasks;
     for (var i = 0; i < tasks.length; i++) {
        if (tasks[i]._id === taskId) {
          $scope.task._id = taskId;
          $scope.task.name =tasks[i].name;
          $scope.task.description =tasks[i].description;
          $scope.task.assignedTo =tasks[i].assignedTo;
          $scope.task.budget =tasks[i].budget;
          $scope.task.startdate = new Date(tasks[i].startDate);
          $scope.task.enddate = new Date(tasks[i].endDate);
        }
      }
      return "";
    };

   $scope.showAlert = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: 'Tasks',
       template: message
     });
     alertPopup.then(function(res) {
       //console.log('Thank you for not eating my delicious ice cream cone');
     });
   };

  $scope.remove = function(taskId) {
    projectsFactory.deleteTask(taskId)
            .success(function () {

                $scope.responseMessage ="Deleted Successfully";
                $scope.showAlert($scope.responseMessage);
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
            $location.path('/tab/account/editTasks/'+$scope.projectId);

  };




})

.controller('ExpensesCtrl', function($scope, $stateParams, projectsFactory,$ionicPopup,$location,scopesFactory) {

  var loggedInUser = scopesFactory.get("loggedinuser");
  if(loggedInUser==undefined || loggedInUser=="" || loggedInUser==null )
  {
    $location.path("/login");
  }
  else
  {
    scopesFactory.store("loggedinuser",loggedInUser);
  }


  $scope.accountVisible=true;
  $scope.tab="tab";
  if(loggedInUser.empType!=2)
  {
    $scope.accountVisible=false;
    $scope.tab ="usertab";
  }
  


    $scope.expenses = {};
    $scope.totalExpense=0;
    $scope.projectId = $stateParams.projectId;
    getExpenses($stateParams.taskId)
    function getExpenses(taskId) {
        projectsFactory.getExpenses(taskId)
            .success(function (expenses) {
                $scope.expenses = expenses;
                getTotalExpense();
                if($stateParams.expenseId!=null && $stateParams.expenseId!="" && $stateParams.expenseId!=undefined)
                {
                  getExpense($stateParams.expenseId);


                }

            })
            .error(function (error) {
                $scope.status = 'Unable to load expenses data: ' + error.message;
            });
    }

    function getTotalExpense()
    {
      var total =0;
      if($scope.expenses!=undefined && $scope.expenses!="" && $scope.expenses!=null)
      {
      if($scope.expenses.taskbreakups.length!=undefined)
      {

      for (var i = 0; i < $scope.expenses.taskbreakups.length; i++) {
          total= total +  $scope.expenses.taskbreakups[i].expense;
        }
        $scope.totalExpense = total;
      }
    }
    }

    $scope.expense = {};
    $scope.expense.category ="";
    $scope.expense.details ="";
    $scope.expense.expense ="";
    $scope.expense.actiondate ="";

    $scope.reset = function() {
        $scope.expense.category ="";
        $scope.expense.details ="";
        $scope.expense.expense ="";
        $scope.expense.actiondate ="";
      };
    
      $scope.addExpense = function(){
         if($scope.expense.category=="" || $scope.expense.details=="" || $scope.expense.expense =="" || $scope.expense.actiondate =="")
      {
        $scope.showAlert("Please enter all the expense information.");
        return;
      }

      var expenseObj = {
        expenseCategory: $scope.expense.category,
        expenseDetails: $scope.expense.details,
        expense: $scope.expense.expense,
        comment: '',
        actionDate: $scope.expense.actiondate,
        projectId:$scope.projectId,
      };
      projectsFactory.addExpense($stateParams.taskId,expenseObj)
            .success(function (data) {
                $scope.responseMessage ="Expense Added Successfully";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "balanced";
                $scope.expense.category="";
                $scope.expense.details="";
                $scope.expense.expense="";
                $scope.expense.actiondate="";
                $location.path('/tab/projects');
              
                //projectsFactory.projects.push(data);
                //$scope.projects= data.data;
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
      
    };

    function getExpense(expenseId)
    {

      var expenses = $scope.expenses.taskbreakups;
     for (var i = 0; i < expenses.length; i++) {
        if (expenses[i]._id === expenseId) {
          $scope.expense._id = expenseId;
          $scope.expense.category =expenses[i].expenseCategory;
          $scope.expense.details =expenses[i].expenseDetails;
          $scope.expense.expense =expenses[i].expense;
          $scope.expense.actiondate = new Date(expenses[i].actionDate);
        }
      }
      return "";
    };


    $scope.submit = function(){
      $scope.addExpense();
    };

    
     $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Expense',
       template: 'Are you sure you want to delete this expense?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $scope.remove($scope.expense._id);
       } else {
         //console.log('You are not sure');
       }
     });
   };

    $scope.showAlert = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: 'Expenses',
       template: message
     });
     alertPopup.then(function(res) {
       //console.log('Thank you for not eating my delicious ice cream cone');
     });
   };

    
  $scope.remove = function(expenseId) {
    projectsFactory.deleteExpense(expenseId);
    $location.path('/tab/expenses/'+$stateParams.taskId);
  }
})



.controller('TabCtrl', function($scope, $stateParams,$location,scopesFactory) {
  
  var loggedInUser = scopesFactory.get("loggedinuser");
  
  $scope.accountVisible=true;
  if(loggedInUser==undefined || loggedInUser=="" || loggedInUser==null )
  {
    $location.path("/login");
  }
  else
  {
    scopesFactory.store("loggedinuser",loggedInUser);
  }

  $scope.userInfo=[];
  $scope.userInfo.empType = loggedInUser.empType;


})

.controller('AdvancesCtrl', function($scope, $stateParams, advancesFactory,$ionicPopup,$location,scopesFactory,projectsFactory) {

  var loggedInUser = scopesFactory.get("loggedinuser");
  $scope.accountVisible=true;
  if(loggedInUser==undefined || loggedInUser=="" || loggedInUser==null )
  {
    $location.path("/login");
  }
  else
  {
    scopesFactory.store("loggedinuser",loggedInUser);
  }

  $scope.tab ="tab";
  $scope.empType=loggedInUser.empType;
  if(loggedInUser.empType!=2)
  {
    $scope.accountVisible=false;
    $scope.tab ="usertab";
  }


    $scope.advances = {};
    getAdvances();
    
    function getAdvances() {
        advancesFactory.getAdvances()
            .success(function (advances) {
                $scope.advances = advances;
                getTotalAdvance();
            })
            .error(function (error) {
                $scope.status = 'Unable to load tasks data: ' + error.message;
            });
    }

    $scope.employees = {};
    getEmployees();
    function getEmployees() {
        projectsFactory.getEmployees()
            .success(function (employees) {
                $scope.employees = employees;
            })
            .error(function (error) {
                $scope.status = 'Unable to load tasks data: ' + error.message;
            });
    }

    
    $scope.advance = {};
    $scope.advance.advancetoWhom ="";
    $scope.advance.advanceMode ="";
    $scope.advance.advanceAmount ="";
    $scope.advance.description ="";
    $scope.advance.advanceDate ="";
    
    $scope.reset = function() {
      $scope.advance.advancetoWhom ="";
      $scope.advance.advanceMode ="";
      $scope.advance.advanceAmount ="";
      $scope.advance.description ="";
      $scope.advance.advanceDate ="";
    
      };

    $scope.submit = function(){
      $scope.addAdvance();
    };

    $scope.addAdvance = function(){
       if($scope.advance.advancetoWhom=="" || $scope.advance.description=="" || $scope.advance.advanceMode =="" || $scope.advance.advanceAmount =="" || $scope.advance.advanceDate=="" )
      {
        $scope.showAlert("Please enter all the advance information.");
        return;
      }
      var advanceObj = {
        advancetoWhom:$scope.advance.advancetoWhom,
        advanceMode:$scope.advance.advanceMode,
        advanceAmount:$scope.advance.advanceAmount,
        description:$scope.advance.description,
        advanceDate:$scope.advance.advanceDate,
      };
      advancesFactory.addAdvance(advanceObj)
            .success(function (data) {
                $scope.responseMessage ="Advance Added Successfully";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "balanced"
                 $scope.advance.advancetoWhom ="";
                $scope.advance.advanceMode ="";
                $scope.advance.advanceAmount ="";
                $scope.advance.description ="";
                $scope.advance.advanceDate ="";
                $location.path('/tab/account/advances');
              }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                $scope.responseMessage ="Some Error Occurred. Please try after some time";
                $scope.showAlert($scope.responseMessage);
                $scope.fontcolor = "assertive";
            });
      
    };

    function getTotalAdvance()
    {
      var total =0;
      if($scope.advances!=undefined && $scope.advances!="" && $scope.advances!=null)
      {
      
      for (var i = 0; i < $scope.advances.length; i++) {
          total= total +  $scope.advances[i].advanceAmount;
        }
        $scope.totalAdvance = total;
      }
      
    }

     $scope.showAlert = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: 'Expenses',
       template: message
     });
     alertPopup.then(function(res) {
       //console.log('Thank you for not eating my delicious ice cream cone');
     });
   };


    function getAdvance()
    {
      var tasks = $scope.tasks.tasks;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i]._id === taskId) {
          $scope.task._id = taskId;
          $scope.task.name =tasks[i].name;
          $scope.task.description =tasks[i].description;
          $scope.task.assignedTo =tasks[i].assignedTo;
          $scope.task.budget =tasks[i].budget;
          $scope.task.startdate = new Date(tasks[i].startDate);
          $scope.task.enddate = new Date(tasks[i].endDate);
        }
      }
      return "";
    };




})

