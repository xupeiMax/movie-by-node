var Movie = require('../models/movie');
var Category = require('../models/category');

// index page
exports.index = function (req, res) {
    console.log('req.session.user:')
    console.log(req.session.user)
    Category.find({})
    .populate({path:'movies',options:{limit: 5}})
    .exec(function (err, categories) {
        if (err) {
            console.log(err)
        }
        res.render('index', {
            title: 'imooc 首页',
            categories: categories
        })
    })
}

// search page
exports.search = function (req, res) {
    var count = 2;
    var catId = req.query.cat;
    var q = req.query.q;
    var page = parseInt(req.query.p, 10) || 0;
    var index = page * count;

    if(catId){
        Category.find({_id:catId})
        .populate({
            path: 'movies',
            select: 'title poster'
        })
        .exec(function (err, categories) {
            if (err) {
                console.log(err)
            }
            var category = categories[0] || {};
            var movies = category.movies;
            var results = movies.slice(index,index + count);
            res.render('results', {
                title: 'imooc 结果列表页',
                keyword: category.name,
                currentPage: page + 1,
                totalPage: Math.ceil(movies.length / count),
                query: 'cat=' + catId,
                movies: results
            })
        })
    } else {
        Movie.find({title: new RegExp((q+'.*'),'i')}).exec(function(err,movies){
            if (err) {
                console.log(err)
            }
            var results = movies.slice(index, index + count);            
            res.render('results', {
                title: 'imooc 结果列表页',
                keyword: q,
                currentPage: page + 1,
                totalPage: Math.ceil(movies.length / count),
                query: 'q=' + q,
                movies: results
            })
        })
    }
}