import Test from "../models/Test.js"; import TestResult from "../models/TestResult.js";
const questionProjection = "-correctAnswer";
export async function listTests(req,res,next)

{try{res.json(await Test.find().populate("questions",questionProjection).sort({createdAt:-1}))}catch(e){next(e)}}
export async function getTest(req,res,next)
{try{const x=await Test.findById(req.params.id).populate("questions",questionProjection);
    if(!x)return res.status(404).json({message:"Test not found"});
    res.json(x)}catch(e){next(e)}}
export async function createTest(req,res,next)
{try{res.status(201).json(await Test.create(req.body))}catch(e){next(e)}}
export async function updateTest(req,res,next)
{try{res.json(await Test.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}))}catch(e){next(e)}}
export async function deleteTest(req,res,next)
{try{await Test.findByIdAndDelete(req.params.id);
    res.json({message:"Test deleted"})}catch(e){next(e)}}
export async function startTest(req,res,next)
{return getTest(req,res,next)}
export async function submitTest(req,res,next)
{try{const test=await Test.findById(req.params.id).populate("questions");
    if(!test)return res.status(404).json({message:"Test not found"});
    const answers=req.body.answers||{};
    let score=0;test.questions.forEach(q=>{const a=answers[String(q._id)];
         if(a!==undefined && q.correctAnswer!==undefined && String(a)===String(q.correctAnswer))score++});
         const total=test.questions.length;const result=await TestResult.create({test:test._id,user:req.user.id,score,total,percentage:total?Math.round(score/total*100):0});
         res.status(201).json({result})}catch(e){next(e)}}
export async function getTestResult(req,res,next)
{try{const x=await TestResult.findOne({_id:req.params.id,user:req.user.id}).populate("test");
if(!x)return res.status(404).json({message:"Result not found"});
res.json(x)}catch(e){next(e)}}
