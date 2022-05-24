import express from "express";
import { protect } from "../controllers/authController.js";
import {
    uploadNFT,
    sellNFT,
    buyNFT,
    getMyNFTCollection,
    getAllNFTCollection,
    getAllNFTsForSale,
    
  } from "../controllers/nftController.js";

const nftRouter = express.Router();

nftRouter.post("/uploadNFT", protect, uploadNFT);
nftRouter.post("/sellNFT", protect, sellNFT);
nftRouter.post("/buyNFT", protect, buyNFT);

nftRouter.get("/myNfts",protect,getMyNFTCollection);
nftRouter.get("/allNfts",getAllNFTCollection);
nftRouter.get("/nftsForSale",getAllNFTsForSale);

export default nftRouter;