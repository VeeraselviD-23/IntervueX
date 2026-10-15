import Notification from "../models/Notification.js";
export async function listNotifications(req,res,next)
{try{const items=await Notification.find({user:req.user.id}).sort({createdAt:-1});
res.json(items)}catch(e){next(e)}}
export async function getNotification(req,res,next)
{try{const item=await Notification.findOne({_id:req.params.id,user:req.user.id});
if(!item)return res.status(404).json({message:"Notification not found"});
res.json(item)}catch(e){next(e)}}
export async function createNotification(req,res,next)
{try{const item=await Notification.create({...req.body,user:req.user.id});
res.status(201).json(item)}catch(e){next(e)}}
export async function updateNotification(req,res,next)
{try{const item=await Notification.findOneAndUpdate({_id:req.params.id,user:req.user.id},req.body,{new:true,runValidators:true});
if(!item)return res.status(404).json({message:"Notification not found"});
res.json(item)}catch(e){next(e)}}
export async function markRead(req,res,next)
{req.body={read:true};
return updateNotification(req,res,next)}
export async function markAllRead(req,res,next)
{try{await Notification.updateMany({user:req.user.id},{read:true});
res.json({message:"All notifications marked as read"})}catch(e){next(e)}}
export async function deleteNotification(req,res,next)
{try{await Notification.findOneAndDelete({_id:req.params.id,user:req.user.id});
res.json({message:"Notification deleted"})}catch(e){next(e)}}
