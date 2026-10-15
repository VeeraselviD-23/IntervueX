import InterviewQuestion from "../models/InterviewQuestion.js";
export async function listInterviewQuestions(req,res,next)
{try{const f={};
if(req.query.category)f.category=req.query.category;
if(req.query.difficulty)f.difficulty=req.query.difficulty;
res.json(await InterviewQuestion.find(f).sort({createdAt:-1}))}catch(e){next(e)}}
export async function getInterviewQuestion(req,res,next)
{try{const x=await InterviewQuestion.findById(req.params.id);
    if(!x)return res.status(404).json({message:"Interview question not found"});
    res.json(x)}catch(e){next(e)}}
export async function categories(req,res,next)
{try{res.json(await InterviewQuestion.distinct("category"))}catch(e){next(e)}}
export async function createInterviewQuestion(req,res,next)
{try{res.status(201).json(await InterviewQuestion.create(req.body))}catch(e){next(e)}}
export async function updateInterviewQuestion(req,res,next)
{try{res.json(await InterviewQuestion.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}))}catch(e){next(e)}}
export async function deleteInterviewQuestion(req,res,next)
{try{await InterviewQuestion.findByIdAndDelete(req.params.id);
    res.json({message:"Interview question deleted"})}catch(e){next(e)}}
