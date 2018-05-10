var User = require('../models/user');

// show signup
exports.showSignup = function (req, res) {
    res.render('signup', {
        title: '用户注册页'
    })
};

// show signin
exports.showSignin = function (req, res) {
    res.render('signin', {
        title: '用户登录页'
    })
};

// signup
exports.signup = function (req, res) {
    var _user = req.body.user;
    User.findOne({ name: _user.name }, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (user) {
            return res.redirect('/signin')
        } else {
            var user = new User(_user);

            user.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/')
            })
        }
    })
}

// signin
exports.signin =  function (req, res) {
    var _user = req.body.user;
    User.findOne({
        name: _user.name
    }, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            return res.redirect('/signup')
        }
        user.comparePassword(_user.password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                req.session.user = user;
                return res.redirect('/')
            } else {
                return res.redirect('/signin')                
            }
        })
    })
}

// logout
exports.logout = function (req, res) {
    delete req.session.user
    res.redirect('/')
}

// userlist page
exports.list =  function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        })
    })
}

// middleware for user
exports.signinRequired = function (req, res,next) {
    var user = req.session.user;
    if(!user){
        res.redirect('/signin')
    }
    next()
}

exports.adminRequired = function (req,res,next){
    var user = req.session.user;
    if (user.role === 'undefined' || user.role <= 10){
        res.redirect('/signin')
    }
    next()    
}