"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.models";
import User from "../models/user.models";
import { connectToDatabase } from "../mongoose";
import { type } from "os";
import { threadId } from "worker_threads";

type createThreadParams= {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}

export async function createThread(params: createThreadParams) {
  try {
    connectToDatabase();
    const { text, author, communityId, path } = params;

    // create thread
    const thread = await Thread.create({
      text,
      author,
      community: null
    });

    // update user
    await User.findByIdAndUpdate(author, {
      $push: {
        threads: thread._id
      }
    });

    // update cache
    revalidatePath(path);

  } catch (error) {
    console.log(error);
  }
}

type FetchThreadsParams = {
  pageNumber: number,
  pageSize: number
}
export async function fetchThreads(params: FetchThreadsParams) {
  try {
    const { pageNumber = 1, pageSize = 20} = params;
    await connectToDatabase();
    const skipAmount = (pageNumber - 1) * pageSize;
    const threadsQuery =  Thread.find({
      parentId: {
        $in: [null, undefined]
      }
    })
    .sort({ createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User})
    .populate({
      path: 'children',
      model: Thread,
      populate: {
        path: 'author',
        model: User,
        select: "_id name parentId image"
      }
    });

    const totalThreadsCount = await Thread.countDocuments({
      parentId: {
        $in: [null, undefined]
      }
    });

    const threads = await threadsQuery.exec();
    const isNext = totalThreadsCount > skipAmount + threads.length;
    return {
      threads,
      isNext
    }
  } catch (error) {
    console.log(error);
  }
}

type FetchThreadsByIdParams = {
  id: string
}
export async function fetchThreadById(params: FetchThreadsByIdParams) {
  try {
    const { id } = params;
    const thread = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id username image'
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id username parentId image'
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id username parentId image'
            }
          }
        ]
      }).exec();

      return thread;
  } catch (error) {
    console.log(error);
  }
}

type AddCommentParams = {
  threadId: string,
  commentText: string,
  userId: string,
  path: string
}
export async function addCommentToThread(params: AddCommentParams) {
  try {
    const { threadId, commentText, userId, path} = params;
    await connectToDatabase();
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error('Thread not found.');
    }
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    });
    const savedCommentThread = await commentThread.save();
    originalThread.children.push(savedCommentThread._id);
    await originalThread.save()
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
