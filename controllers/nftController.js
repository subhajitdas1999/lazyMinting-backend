import NFTDetail from "../model/NFTDetailModel.js";
import Moralis from "moralis/node.js";
import { BigNumber, ethers } from "ethers";
import AppError from "../utils/appError.js";
import dotenv from "dotenv";
import catchAsync from "../utils/catchAsync.js";

dotenv.config({ path: "../.env" });

//upload a nft
const uploadNFT = catchAsync(async (req, res, next) => {
  if (!req.files) {
    return next(new AppError(401, "Cannot proceed with empty file"));
  }
  //morails init code
  await Moralis.start({
    serverUrl: process.env.SERVER_URL,
    appId: process.env.APPLICATION_ID,
    masterKey: process.env.MASTER_KEY,
  });

  //the data section in req.files.NFTImage is a buffer array we need to convert it to the image array for upload
  const data = Array.from(Buffer.from(req.files.NFTImage.data, "binary"));

  const file = new Moralis.File(req.files.NFTImage.name, data);
  await file.saveIPFS({ useMasterKey: true });

  // file.hash() = returns the ipfs hash
  // file.ipfs() = morails link with ipfs hash

  //create a token ID (uint) from the file hash string
  const tokenId = BigNumber.from(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(file.hash()))
  ).toString();

  //metadata of the NFT art
  const jsonMetadata = {
    tokenId: tokenId,
    description: req.body.description,
    imageURI: `ipfs://${file.hash()}`,
  };

  //upload the JSON metadata to IPFS
  const toBtoa = Buffer.from(JSON.stringify(jsonMetadata)).toString("base64");
  const jsonDataFileName = `ipfs-${file.hash()}.json`;
  const jsonfile = new Moralis.File(jsonDataFileName, { base64: toBtoa });
  await jsonfile.saveIPFS({ useMasterKey: true });

  // console.log(jsonfile.ipfs());

  //this is protected route that's why we get accessed to req.user
  const NFTDocument = {
    user: req.user._id,
    tokenId: tokenId,
    tokenURI: `ipfs://${file.hash()}`,
    artLink: jsonfile.ipfs(),
    artDescription: req.body.description,
  };

  //Upload the NFT document
  const nftDetail = await NFTDetail.create(NFTDocument);

  //send the response
  res.status(201).json({
    status: "success",
    data: {
      nftDetail,
    },
  });
});

//list fro sale
const sellNFT = catchAsync(async (req, res, next) => {
  //get the NFT document
  const nftDetails = await NFTDetail.findById(req.body.id);

  if (!nftDetails) {
    return next(
      new AppError(401, "NFT Document is not present in out collection")
    );
  }

  //min price Should be 0.000001 ether
  if (req.body.price < process.env.MIN_NFT_PRICE) {
    return next(
      new AppError(
        401,
        "Minimum NFT selling price should be greater than 0.000001 ether"
      )
    );
  }
  //update the NFT DEtails for sell
  nftDetails.isForSale = true;
  nftDetails.signatureForNFT = req.body.signature;
  nftDetails.sellPrice = req.body.price;

  //save the updated details
  await nftDetails.save();

  //send the response
  res.status(201).json({
    status: "success",
    data: {
      nftDetails,
    },
  });
});

//buy a NFT
const buyNFT = catchAsync(async (req, res, next) => {
  //get the NFT details from collection
  const nftDetails = await NFTDetail.findById(req.body.id);

  //update the collection

  //make the logged in user owner
  nftDetails.user = req.user._id;

  //make it again not for sale until user list it for sale
  nftDetails.isForSale = false;

  //if someone is buying the nft first time (NFT offchain from on chain) make on chain true
  if (!nftDetails.isTokenOnchain) {
    nftDetails.isTokenOnchain = true;
  }

  //save the owner address
  nftDetails.ownerAddress = req.body.ownerAddress;
  //remove the signature of prev user
  nftDetails.signatureForNFT = "";
  // setting sell price to 0
  nftDetails.sellPrice = 0;

  await nftDetails.save();

  //send the response
  res.status(201).json({
    status: "success",
    data: {
      nftDetails,
    },
  });
});

const getAllNFTsForSale = catchAsync(async (req, res, next) => {
  const nftCollections = await NFTDetail.find({ isForSale: true });
  //send the response
  res.status(201).json({
    status: "success",
    length: nftCollections.length,
    data: {
      nftCollections,
    },
  });
});

const getMyNFTCollection = catchAsync(async (req, res, next) => {
  const nftCollections = await NFTDetail.find({ user: req.user._id });

  //send the response
  res.status(200).json({
    status: "success",
    length: nftCollections.length,
    data: {
      nftCollections,
    },
  });
});

const getAllNFTCollection = catchAsync(async (req, res, next) => {
  const nftCollections = await NFTDetail.find();

  //send the response
  res.status(201).json({
    status: "success",
    length: nftCollections.length,
    data: {
      nftCollections,
    },
  });
});

export {
  uploadNFT,
  sellNFT,
  getAllNFTCollection,
  getMyNFTCollection,
  buyNFT,
  getAllNFTsForSale,
};
