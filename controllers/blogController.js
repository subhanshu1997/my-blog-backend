const express=require('express')
const mongoose=require('mongoose')
const user=require('./../models/blog')
const BlogModel=mongoose.model('Blog')
const shortId=require('shortid')
const response=require('./../libs/responseLib')
const time=require('./../libs/timeLib')
const check=require('./../libs/checkLib')
const logger=require('./../libs/loggerLib')
let getAllBlog=(req,res)=>{
    BlogModel.find()
    .select('-__v -_id')
    .lean()
    .exec((err,result)=>{
        if(err){
            console.log(err)
            logger.error(err.message, 'Blog Controller: getAllBlog', 10)
                let apiResponse = response.generate(true, 'Failed To Find Blog Details', 500, null)
                res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            logger.info('No Blog Found', 'Blog Controller: getAllBlog')
            let apiResponse = response.generate(true, 'No Blog Found', 404, null)
            res.send(apiResponse)
        }
        else{
            let apiResponse = response.generate(false, 'All Blog Details Found', 200, result)
            res.send(apiResponse)
        }
    })
}
let viewByBlogId = (req,res)=>{
    console.log("Hello")
    BlogModel.findOne({'blogId':req.params.blogId},(err,result)=>{
        if (err) {
            console.log('Error Occured.')
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured.', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {

            console.log('Blog Not Found.')
            let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
            res.send(apiResponse)
        } else {
            logger.info("Blog found successfully","BlogController:ViewBlogById",5)
            let apiResponse = response.generate(false, 'Blog Found Successfully.', 200, result)
            res.send(apiResponse)
        }
    })
}

let viewByCategory = (req,res)=>{
    BlogModel.find({'category':req.params.category},(err,result)=>{
        if (err) {

            console.log('Error Occured.')
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured.', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {

            console.log('Blogs Not Found.')
            let apiResponse = response.generate(true, 'Blogs Not Found', 404, null)
            res.send(apiResponse)
        } else {
            console.log('Blogs Found Successfully')
            let apiResponse = response.generate(false, 'Blogs Found Successfully.', 200, result)
            res.send(apiResponse)
        }
    })
}

let viewByAuthor = (req,res)=>{
    BlogModel.find({'author':req.params.author},(err,result)=>{
        if (err) {

            console.log('Error Occured.')
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured.', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {

            console.log('Blogs Not Found.')
            let apiResponse = response.generate(true, 'Blogs Not Found', 404, null)
            res.send(apiResponse)
        } else {
            console.log('Blogs Found Successfully')
            let apiResponse = response.generate(false, 'Blogs Found Successfully.', 200, result)
            res.send(apiResponse)
        }
    })
}

let editBlog = (req,res) =>{
    let options = req.body
    console.log(options)
    BlogModel.update({'blogId':req.params.blogId},options,{multi:true}).exec((err,result)=>{
        if (err) {

            console.log('Error Occured.')
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured.', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {

            console.log('Blog Not Found.')
            let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
            res.send(apiResponse)
        } else {
            console.log('Blog Edited Successfully')
            let apiResponse = response.generate(false, 'Blog Edited Successfully.', 200, result)
            res.send(apiResponse)
        }
    })
}

let deleteBlog = (req,res) =>{
    BlogModel.remove({'blogId':req.params.blogId},(err,result)=>{
        if (err) {
            console.log('Error Occured.')
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured.', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            console.log('Blog Not Found.')
            let apiResponse = response.generate(true, 'Blog Not Found.', 404, null)
            res.send(apiResponse)
        } else {
            console.log('Blog Deletion Success')
            let apiResponse = response.generate(false, 'Blog Deleted Successfully', 200, result)
            res.send(apiResponse)
        }
    })
}

let createBlog = (req,res) =>{
    var today=time.now()
    let blogId = shortId.generate()
    let newBlog = new BlogModel({
        blogId:blogId,
        title:req.body.title,
        description:req.body.description,
        bodyHtml:req.body.bodyHtml,
        isPublished:true,
        category:req.body.category,
        author:req.body.fullname,
        created:today,
        lastModified:today
    })
    
    let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '')? req.body.tags.split(',') : []
    newBlog.tags = tags
    newBlog.save((err,result)=>{
        if (err) {
            console.log('Error Occured.')
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured.', 500, null)
            res.send(apiResponse)
        } else {
            console.log('Success in blog creation')
            res.send(result)
        }
    }) 
}

let increaseBlogView = (req,res)=>{
    BlogModel.findOne({'blogId':req.params.blogId},(err,result)=>{
        if (err) {
    
            console.log('Error Occured.')
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured.', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {

            console.log('Blog Not Found.')
            let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
            res.send(apiResponse)}
        else{
            result.views += 1
            result.save(function (err,result){
                if(err){
                    console.log('Error Occured.')
                    logger.error(`Error Occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured While saving blog', 500, null)
                    res.send(apiResponse)
                }
                else{
                    console.log('Blog Updated Successfully')
                    let apiResponse = response.generate(false, 'Blog Updated Successfully.', 200, result)
                    res.send(apiResponse)
                }
            })
        }
    })
}
module.exports = {
    getAllBlog : getAllBlog,
    viewByCategory : viewByCategory,
    increaseBlogView : increaseBlogView,
    createBlog : createBlog,
    deleteBlog : deleteBlog,
    editBlog : editBlog,
    viewByBlogId : viewByBlogId,
    viewByAuthor : viewByAuthor
}












// ---------------------------------------------------------//
// let testRoute=(req,res)=>{
//         console.log(req.params)
//         res.send(req.params)
//     }
//     let testQuery=(req,res)=>{
//         console.log(req.query)
//         res.send(req.query)
//     }
//     let testBody=(req,res)=>{
//         console.log(req.body)
//         res.send(req.body)
//     }
//     module.exports={
//     testRoute:testRoute,
//     testQuery:testQuery,
//     testBody:testBody
// }