import mongoose, { model, Schema } from "mongoose";
require('mongoose-double')(mongoose);
 
var SchemaTypes = mongoose.Schema.Types;


const productSchema = new Schema({
   
    productName:{
        type:String,
        required: true
    },
    
    detail:{
        type:String,
        required: true

    },
    price:{
        type:Number,
        required: true

    },
    discount:{
        type:Number,
        required: true
    },

    
},{versionKey:false,timestamps:true})

const product = model('product',productSchema,'product')
export {productSchema}
export default product