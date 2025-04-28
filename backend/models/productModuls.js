const mongoose = require("mongoose")

const productSchema = new mongoose.schema({
    name:{
        type:string,
        required:[true, "Please provide a name"],
        trim:[true, "Product name can not ecceed 100 characters."]
    },
    price:{
        type:numer,
        default:0
    },
    discription:{
        type: string,
        title:[true, "Please enter product discriotion."]
    },
    ratings:{
        type: string,
        title:0
    },
    images:[
        {
            filename:{
                type: string,
                required: true
            }
        }
    ],
    category:{
        type: string,
        required: [true, "Please provide a category"]
    }
})