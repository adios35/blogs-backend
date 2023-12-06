import {Article} from "../models/schema.js";
import verify from "../middleware/verify.js";
import Express from "express"

const router = Express.Router();

router.get("/", async (req, res) => {
  const articles = await Article.find().populate({
    path: "author",
    select: { username: 1, email: 1 }})
  res.status(200).json({posts:articles});
});


router.post("/create",verify, async (req, res) => {
  const {title, content,category} = req.body;
 try {
   const newArticle = new Article({title, content,category,author:req.session.user._id});
   const article = await newArticle.save();
   
   res.status(200).json({post: article});
 } catch (error) {
   console.log(error);
   res.status(500).json({error: "Something went wrong"});
 }
});

router.post("/update/:id",verify, async (req, res) => {
  const {title, content} = req.body;
  const id = req.params.id;
 try {
   const updateArticle  =  await Article.findOneAndUpdate({ _id: id },  req.body , { new: true });
   res.status(200).json({post: updateArticle});
 }catch (error){
   console.log(error)
   res.status(500).json({error: "Something went wrong"});  
 }
})

            
router.delete("/delete/:id",verify, async (req, res) => {
  const id = req.params.id;
 try {
   const deleteArticle  =  await Article.findOneAndDelete({ _id: id });
   res.status(200).json({message:"article is deleted",post: deleteArticle});
 }catch (error){  
   res.status(500).json({error: "Something went wrong"});
 }
})

export default router