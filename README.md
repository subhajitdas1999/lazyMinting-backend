# lazyMinting-backend

[Overview](#overview)<br>
[Api Documentation](#api-documentation)<br>
[Hosted Backend](#hosted-backend)<br>
[project setup](#project-setup)<br>

## **Overview**

This backend part of lazy Minting , handles the authentication, off chain NFT upload , uploads user details,and Nft details to the Database .

For authentication server handles jwt token with 1 day validity .

For uploading NFT, this server connects to the IPFS, using Morails server , and uploads the image to the ipfs .

To create a token id of an NFT, server uses ethers js module to calculate the token Id based on token uri (receiving from ipfs).

To handle authorization and off chain NFT this server connects to a mongodb database , which stores all the users data , nft data.

***

## **Hosted Backend**

The backend hosted at [link](https://my-lazy-minting.herokuapp.com/)

For ex if you hit (https://my-lazy-minting.herokuapp.com/) this route You will get error, as nothing is specified for **(/)** this route.

For Now every thing is specified under **(/api/####)** routes

if You want all the NFT details .Hit this url instead.
 ```
 https://my-lazy-minting.herokuapp.com/api/nft/allNfts
 ```
## **Api Documentation**

Postman Api documentation [link](https://documenter.getpostman.com/view/15761755/UyxnCjDk)

***

## **project setup**

1. clone the repository

```
git clone https://github.com/subhajitdas1999/lazyMinting-backend.git
```

2. change the directory and change branch if required

```
cd lazyMinting-backend
```

to change branch 

```
git switch <branch name>
```

3. create a .env file ,See the .env.example file for details


4. Install dependencies

```
npm i
```
5. set up the database string in server.js and and .env file

6. Run 

```
npm start
```

