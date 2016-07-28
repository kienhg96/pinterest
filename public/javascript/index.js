function imgErr(img){
	console.log('img err');
	img.onerror = "";
    img.src = "/image/error.png";
    return true;
}

var Parent;
var Current;

var arrMypins = null;
var Super = null;
$(document).ready(function(){
	console.log('Hello, this is Jquery');
	var EventDropdown = function(){
		$(".dropdown-toggle").click(function(){
			var isOpen = $(this).parent().hasClass('open');
			$(".dropdown").removeClass('open');
			if (!isOpen){
				$(this).parent().addClass('open');
				$('.username').focus();
				$('.username').keyup(function(e){
					if (e.keyCode == 13){
						fnBtnLoginClick();
					}
				});
				$('.password').keyup(function(e){
					if (e.keyCode == 13){
						fnBtnLoginClick();
					}
				});
			}
			return false;
		});
		$('body').on('click', function (e) {
		    if (!$('.dropdown').is(e.target) 
		        && $('.dropdown').has(e.target).length === 0 

		    ) {
		        $('.dropdown').removeClass('open');
		    }	
		});
	}
	EventDropdown();
	/*
	$.get('/pin', function(result){
		if (result.errCode === 0){
			var data = result.data;
			for (var i = 0; i < data.length; i++){
				var title = data[i].title;
				var imgUrl = data[i].imgUrl;
				//console.log(title);
				//console.log(imgUrl);
				var html = '<div class="pin"><img src="' + imgUrl + '" onerror="imgErr(this);"/><p>' + title + '</p></div>';
				columns.append(html);
			}
		}
	});
	*/
	var btnLogin = $('#btnLogin');
	var btnSignup = $('#btnSignup');
	var btnLogout = $('#btnLogout');
	var columns = $('#columns');
	var fnBtnLogoutClick = function(){
		$.get('/logout', function(data){
			//console.log(data);
			if (data.errCode === 0){
				arrMypins = null;
				$('.dropdown').removeClass('open');
				$('#rightPanel').html('<li class="dropdown"><a href="#" class="dropdown-toggle"><span class="glyphicon glyphicon-user"></span> Signup <span class="caret"></span></a><ul class="dropdown-menu"><li><div class="form"><input placeholder="Username" class="form-control username"/><input placeholder="Password" type="password" class="form-control password"/><input id="repPassword" placeholder="Repeat password" type="password" class="form-control"/><button id="btnSignup" class="btn btn-primary form-control">Sign up</button></div></li></ul></li><li class="dropdown"><a href="#" class="dropdown-toggle"><span class="glyphicon glyphicon-log-in"></span> Login <span class="caret"></span></a><ul class="dropdown-menu"><li><div class="form"><input placeholder="Username" class="form-control username"/><input placeholder="Password" type="password" class="form-control password"/><button id="btnLogin" class="btn btn-primary form-control">Login</button></div></li></ul></li>');
				btnLogin = $('#btnLogin');
				btnLogin.click(fnBtnLoginClick);
				EventDropdown();
				$('a').click(fnAnchorClick);
				$('#btnSignup').click(fnSignup);
				//console.log('Goto get');
				if (window.location.pathname !== '/'){
					columns.html('');
					window.history.pushState('/', null, '/');
					$.get('/pin', function(result){
						//console.log('out of get');
						//console.log(result);
						if (result.errCode === 0){
							columns.html('');
							for (var i = 0; i < result.data.length; i++){
								var html = '<div class="pin"><img src="' + result.data[i].imgUrl + '" onerror="imgErr(this);"/><p>' + result.data[i].title + '</p></div>';
								columns.append(html);
							}
						}
					});
				}
			}
		});
	}
	var fnBtnLoginClick = function() {
		var username = btnLogin.parent().find('.username').val();
		var password = btnLogin.parent().find('.password').val();
		//console.log(username);
		//console.log(password);
		$.post('/login', {username: username, password: password}, function(data){
			console.log(data);
			if (data.errCode === 0) {
				$('.dropdown').removeClass('open');
				$('#rightPanel').html('<li><a href="/mypins">My Pins</a></li><li class="dropdown"><a class="dropdown-toggle" href="#">Add Pins <span class="caret"></span></a><ul class="dropdown-menu"><li><div class="form"><input class="form-control" id="imgTitle" placeholder="Title here"/><input class="form-control" id="imgUrl" placeholder="Image Url here"/><button class="btn btn-primary form-control" id="btnPostpin">Post this pin</button></div></li></ul></li><li class="dropdown"><a class="dropdown-toggle" href="#">Hello, ' + data.user.username + ' <span class="caret"></span></a><ul class="dropdown-menu"><li><div class="form"><button id="btnLogout" class="btn btn-primary form-control">Logout</button></li></ul></li>');
				EventDropdown();
				btnLogout = $('#btnLogout');
				btnLogout.click(fnBtnLogoutClick);
				$('a').click(fnAnchorClick);
			}
			else {
				btnLogin.parent().notify('Invalid Username or Password', {className: 'error', position: 'bottom'});
			}
		});
	}
	$('body').on('click', '#btnPostpin', function(){
		//console.log($(this));
		//console.log($('#imgUrl').val());
		//console.log($('#imgTitle').val());
		var title = $('#imgTitle').val();
		var url = $('#imgUrl').val();
		$('#imgTitle').val('');
		$('#imgUrl').val('');
		$.post('/postpin', {title: title, imgUrl: url}, function(result){
			if (result.errCode === 0){
				$('.dropdown').removeClass('open');
				$('#columns').prepend('<div class="pin"><img src="'+ url +'" onerror="imgErr(this);"/><p>' + title +'</p></div>')
			}
		});
	});
	$('body').on('click', '.btnDel', function(){
		console.log($(this).parent().index());
		var index = $(this).parent().index();
		//var parent = $(this).parent().parent();
		var current = $(this).parent();
		$.get('/mypin', function(result){
			if (result.errCode === 0){
				arrMypins = result.data;
				$.post('/delpins', {id : arrMypins[index]._id}, function(result){
					if (result.errCode === 0){
						current.remove();
					}
				});
			}
		});

	});
	var fnAnchorClick = function(e){
		console.log($(this).attr('href'));
		var href = $(this).attr('href');
		if (href !== '#'){
			if (href === '/mypins') {
				$.get('/mypin', function(result){
					if (result.errCode === 0){
						columns.html('');
						//console.log(result.data);
						arrMypins = result.data;
						for (var i = 0; i < result.data.length; i++){
							var html = '<div class="pin"><img src="' + result.data[i].imgUrl + '" onerror="imgErr(this);" /><p>' + result.data[i].title + '</p><button class="btn btn-danger btn-xs btnDel">Delete</button></div>';
							columns.append(html);
						}
						window.history.pushState(href, null, href);
					}
					else {
						window.location = '/';
					}
				});
			} else if (href === '/'){
				$.get('/pin', function(result){
					if (result.errCode === 0){
						columns.html('');
						for (var i = 0; i < result.data.length; i++){
							var html = '<div class="pin"><img src="' + result.data[i].imgUrl + '" onerror="imgErr(this);"/><p>' + result.data[i].title + '</p></div>';
							columns.append(html);
						}
						window.history.pushState(href, null, href);
					} else {
						window.location = '/';
					}
				});
			}
		}
		return false;
	}
	var fnSignup = function(){
		btnSignup = $(this);
		var username = $(this).parent().find('.username').val();
		var password = $(this).parent().find('.password').val();
		var repPassword = $(this).parent().find('#repPassword').val();
		console.log(username);
		console.log(password);
		console.log(repPassword);
		if (password === repPassword) {
			$.post('/signup', {username: username, password: password}, function(result){
				if (result.errCode === 0) {
					$('.dropdown').removeClass('open');
					$('#rightPanel').html('<li><a href="/mypins">My Pins</a></li><li class="dropdown"><a class="dropdown-toggle" href="#">Hello, ' +result.username + ' <span class="caret"></span></a><ul class="dropdown-menu"><li><div class="form"><button id="btnLogout" class="btn btn-primary form-control">Logout</button></li></ul></li>');
					EventDropdown();
					btnLogout = $('#btnLogout');
					btnLogout.click(fnBtnLogoutClick);
					$('a').click(fnAnchorClick);
				}
				else {
					btnSignup.parent().notify('Username already exists', {className: 'error', position: 'bottom'});
				}
			});
		}
		else {
			btnSignup.parent().notify('Retype password mismatch', {className: 'error', position: 'bottom'});
		}
	}
	$('#btnSignup').click(fnSignup);
	$('a').click(fnAnchorClick);
	btnLogin.click(fnBtnLoginClick);
	btnLogout.click(fnBtnLogoutClick);
	window.addEventListener('popstate', function(e){
		var href = e.state;
		console.log(href);
		if (href === '/mypins') {
				$.get('/mypin', function(result){
					if (result.errCode === 0){
						columns.html('');
						for (var i = 0; i < result.data.length; i++){
							var html = '<div class="pin"><img src="' + result.data[i].imgUrl + '" onerror="imgErr(this);"/><p>' + result.data[i].title + '</p><button class="btn btn-danger btn-xs btnDel">Delete</button></div>';
							columns.append(html);
						}
					}
					else {
						window.location = '/';
					} 
				});
			} else if (href === '/'){
				$.get('/pin', function(result){
					if (result.errCode === 0){
						columns.html('');
						for (var i = 0; i < result.data.length; i++){
							var html = '<div class="pin"><img src="' + result.data[i].imgUrl + '" onerror="imgErr(this);"/><p>' + result.data[i].title + '</p></div>';
							columns.append(html);
						}
					}
				});
			}
	});
});