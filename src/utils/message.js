const generateMessage = (username,text) =>{
    return{
        text,
        username,
        createdAt: new Date().getTime()
    }
}


const generateLocationMessage = (userName,url) =>{

    return {
        userName,
        url,
        ceatedAt : new Date().getTime()
    }
}



module.exports = {
    generateMessage,
    generateLocationMessage
}