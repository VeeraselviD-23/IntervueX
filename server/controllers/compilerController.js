import CodingQuestion from "../models/CodingQuestion.js";
import Submission from "../models/Submission.js";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const executeFile = promisify(execFile);

async function runJava(code) {
 const workspace=await mkdtemp(join(tmpdir(),"intervuex-java-"));
 try {
  await writeFile(join(workspace,"Main.java"),code,"utf8");
  await executeFile("javac",["Main.java"],{cwd:workspace,timeout:10000,maxBuffer:20000,windowsHide:true});
  const result=await executeFile("java",["-cp",workspace,"Main"],{cwd:workspace,timeout:5000,maxBuffer:20000,windowsHide:true});
  return result.stdout || result.stderr || "Code ran successfully with no output.";
 } catch(error) {
  if(error.code === "ENOENT") throw new Error("Java runtime is not installed on the server. Install a JDK and add javac and java to PATH.");
  return [error.stdout,error.stderr,error.message].filter(Boolean).join("\n");
 } finally { await rm(workspace,{recursive:true,force:true}); }
}
export async function listCodingQuestions(req,res,next)
    {try{const f={};
    if(req.query.category)f.category=req.query.category;
    if(req.query.difficulty)f.difficulty=req.query.difficulty;
    res.json(await CodingQuestion.find(f).sort({createdAt:-1}))}catch(e){next(e)}}
export async function getCodingQuestion(req,res,next)
{try{const x=await CodingQuestion.findById(req.params.id);
    if(!x)return res.status(404).json({message:"Coding question not found"});
    res.json(x)}catch(e){next(e)}}
export async function createCodingQuestion(req,res,next)
{try{res.status(201).json(await CodingQuestion.create(req.body))}catch(e){next(e)}}
export async function updateCodingQuestion(req,res,next)
{try{res.json(await CodingQuestion.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}))}catch(e){next(e)}}
export async function deleteCodingQuestion(req,res,next)
{try{await CodingQuestion.findByIdAndDelete(req.params.id);
    res.json({message:"Coding question deleted"})}catch(e){next(e)}}
export async function runCode(req,res,next)
{try{const {language,code}=req.body;
if(!code||typeof code!=="string")return res.status(400).json({message:"Code is required"});
if(language==="java")return res.json({success:true,output:await runJava(code)});
return res.status(400).json({message:`${language||"This"} runtime is not configured on the server`});
}catch(error){next(error)}}
export async function submitCode(req,res,next)
{try{const {language,code,question,questionTitle,output,status}=req.body;
if(!language||!code)return res.status(400).json({message:"Language and code are required"});
const submission=await Submission.create({user:req.user.id,language,code,question,questionTitle,output,status});
res.status(201).json({success:true,message:"Code submitted",submission})}catch(error){next(error)}}
export async function submissions(req,res,next)
{try{res.json(await Submission.find({user:req.user.id}).populate("question","title").sort({createdAt:-1}))}catch(error){next(error)}}
