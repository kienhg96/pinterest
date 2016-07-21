$(document).ready(function(){
    console.log('Hello, this is jquery');
    var btnLogin = $('#login');
    var btnSignup = $('#signup');
    var btnLogout = $('#logout');
    var btnPostPin = $('#postpin');
    var btnUser = $('#user');
    var txtUsername = $('#username');
    var txtPassword = $('#password');
    var txtUrl = $('#url');
    var txtTitle = $('#title');
    btnLogin.click(function(){
       var username = txtUsername.val();
       var password = txtPassword.val();
       $.post('/login', {username: username, password: password}, function(data){
           console.log(data);
       });
    });
    btnSignup.click(function(){
        var username = txtUsername.val();
        var password = txtPassword.val();
        
        $.post('/signup', {username: username, password: password}, function(data){
           console.log(data);
        });
    });
    btnLogout.click(function(){
       $.get('/logout', function(data){
           console.log(data);
       }) 
    });
    btnUser.click(function(){
        $.get('/user', function(data){
            console.log(data);
        })
    });
    btnPostPin.click(function(){
        var title = txtTitle.val();
        var url = txtUrl.val();
        $.post('/postpin', {imgUrl: url, title: title}, function(data){
           console.log(data); 
        });
    });
});