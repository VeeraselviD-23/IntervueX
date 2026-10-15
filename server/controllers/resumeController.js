import Resume from "../models/Resume.js";
export async function listResumes(req,res,next)
{try{res.json(await Resume.find({user:req.user.id}).sort({createdAt:-1}))}catch(e){next(e)}}
export async function getResume(req,res,next)
{try{const x=await Resume.findOne({_id:req.params.id,user:req.user.id});
if(!x)return res.status(404).json({message:"Resume not found"});
res.json(x)}catch(e){next(e)}}
export async function createResume(req,res,next)
{try{const data={...req.body,user:req.user.id};
if(req.file){data.fileName=req.file.originalname;
    data.fileUrl=`/uploads/resumes/${req.file.filename}`}res.status(201).json(await Resume.create(data))}catch(e){next(e)}}
export async function updateResume(req,res,next){try{const x=await Resume.findOneAndUpdate({_id:req.params.id,user:req.user.id},req.body,{new:true,runValidators:true});
if(!x)return res.status(404).json({message:"Resume not found"});
res.json(x)}catch(e){next(e)}}
export async function deleteResume(req,res,next)
{try{const x=await Resume.findOneAndDelete({_id:req.params.id,user:req.user.id});
if(!x)return res.status(404).json({message:"Resume not found"});
res.json({message:"Resume deleted"})}catch(e){next(e)}}
