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
        required: [true, "Please provide a category"],
        enum:{
            values:[
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauly/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: "Please select a valid category"
        }
    },
    seller:{
        type: string,
        required: [true, "Please Enter Product seller"]
    },
    stock:{
        type: Number,
        required:[true, "Please enter product stock"],
        maxLength: [20, "Product stock can not exceed 20"],
        
    },
    numberOfReviews:{
        type: Number,
        default: 0,

    },
    reviews:[
     {
            name:{
            type: string,
            required: true

        },
        rating:{
            type: string,
            required: true
        },
        comment:{
            type: string,
            required:true
        }
     }
        
    ],
    creatAt:{
        type: Date,
        default: Date.now()
    }
})