let generate = (err,message,status,data)=>{
    let response={
        error:err,
        messgae : message,
        status : status,
        data : data
    }
    return response
}
module.exports ={
    generate :generate
}