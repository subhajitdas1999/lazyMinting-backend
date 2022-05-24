import mongoose from "mongoose";

const NFTDetailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A User is required"],
  },
  artLink: {
    type: String,
    required: [true, "A NFT Art is required"],
  },
  artDescription : {
    type : String,
    required : [true , "A NFT art description is required"],
  },
  tokenId : {
    type : String,
    required : [true ,"A NFT token id is required"]
  },
  tokenURI : {
    type : String,
    required : [true ,"A NFT token uri is required"]
  },
  isTokenOnchain :{
    type : Boolean,
    default : false
  },
  ownerAddress:{
    type:String,
    default:""
  },
  isForSale :{
    type : Boolean,
    default :false
  },
  signatureForNFT:{
    type : String,
    default : ""
  },
  sellPrice : {
    type : Number,
    default : 0,
    
  }
});

const NFTDetail = mongoose.model("NFTDetail",NFTDetailSchema)

export default NFTDetail;