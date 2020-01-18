const path = require('path');
const ctrl ={};
const {randomNumber}=require('../helpers/libs');
const fs=require('fs-extra');
const md5 = require('md5');
const { Image,Comment }=require('../models/');
const sidebar=require('../helpers/sidebar');
ctrl.index= async (req,res)=>{

	let viewModel = {image:{},comments:{}};
	console.log(req.params.image_id);
	const  image=await Image.findOne({filename:{$regex:req.params.image_id}});
	if(image){
		
		image.views = image.views+1;
		viewModel.image=image;
	await image.save();
	const comments =await Comment.find({image_id:image._id});
	viewModel.comments=comments;
	 viewModel=await sidebar(viewModel);
	//console.log(image);
	res.render('image',viewModel);
}else{

	res.redirect('/');
	//res.send("Holaa");
}
}

 ctrl.create= (req,res)=>{

 	const saveImage = async()=>{
 		const imgURL=randomNumber();
 	const images= await Image.find({ filename: imgURL });
 	if(images.length>0){

 		saveImage();
 	}else{

 		console.log(imgURL);

 	const imageTemPath=req.file.path;
 	const  ext = path.extname(req.file.originalname).toLowerCase();
 	const targetPath = path.resolve( `src/public/upload/${imgURL}${ext}`);
 	if( ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif'){
 			
 			await fs.rename(imageTemPath,targetPath);
 			const newImg=new Image({
 				title:req.body.title,
 				filename : imgURL+ext,
 				description: req.body.description,
 			});
 				const imageSaved=await newImg.save();
 				res.redirect('/images/'+imgURL);

 	}else{
 		await fs.unlink(imageTemPath);
 		
 		res.status(500).json({error:'Only Image are allowed'});
 		
 	}
 	//res.send('works!');

 	}
 	
 	}

 	saveImage();
 	
 }


 ctrl.like = async (req,res)=>{
 		const image=await Image.findOne({filename:{$regex : req.params.image_id}})
 		if(image){
 			image.likes=image.likes +1;
 			await image.save();
 			res.json({likes:image.likes});
 		}else{
 			res.status(500).json({error:'Internal Error'});
 		}
 }

 ctrl.comment= async (req,res)=>{
 	 console.log(req.body);
 	 const image= await Image.findOne({filename:{$regex : req.params.image_id}});
 	 if(image){
 	 		 const newComment =new Comment(req.body);
 	 		 newComment.gravatar= md5(newComment.email);
 	 		 newComment.image_id=image._id;
 	 		 await newComment.save();
 	 		 res.redirect('/images/'+image.uniqueId);
 	 }
 	
 }

 ctrl.delete= async (req,res)=>{
 	 const  image= await Image.findOne({filename:{$regex:req.params.image_id}});
 	if(image){
 			await fs.unlink(path.resolve('./src/public/upload/'+image.filename));
 			await Comment.deleteOne({image_id:image._id});
 			await image.remove();
 			res.json(true);
 	}

 }
module.exports=ctrl;