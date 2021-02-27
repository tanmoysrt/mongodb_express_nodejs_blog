const express = require('express')
const router = express.Router()
const Article = require('../models/articles')

router.get('/new',(rqe,res)=>{
    res.render('articles/new',{article: new Article()})
})


router.post('/',async (req,res,next)=>{
    req.article = new Article() 
    next()
},savearticleAndredirect('new'))

router.get('/:slug',async  (req,res)=>{
    try {
        const article = await Article.find({slug : req.params.slug})
        console.log(article.length)
        if(article.length == 0){
            res.redirect('/')
        }
        res.render('articles/show',{article:article[0]})
    } catch (error) {
        res.send("Post Not Found")
    }

})


router.delete('/:id', async (req,res)=>{
    // console.log(req.params.id)
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
    }
)

router.get('/edit/:id', async(req,res)=>{
    const article = await Article.findById(req.params.id)
    // console.log(article.data)
    res.render('articles/edit',{article:article})
})

router.put('/:id',async (req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    next()
},savearticleAndredirect('edit'))

function savearticleAndredirect(path){
    return async (req,res)=>{
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
    
        try {
            article = await article.save();
            // console.log("HITT");
            // console.log(article);
            res.redirect(`/articles/${article.slug}`);
        } catch (error) {
            res.redirect(`articles/${path}`,{article:article})
        }
    }
}

module.exports = router