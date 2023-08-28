"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDatabase } from "../mongoose";
import Thread from "../models/thread.models";
import { FilterQuery, SortOrder } from "mongoose";

export async function updateUser(data: any): Promise<void> {
  const  {
    userId,
    username,
    name,
    bio,
    image,
    path,
  } = data;

  try {
    await connectToDatabase();
    await User.findOneAndUpdate({
      id: userId
    }, {
      username: username.toLowerCase(),
      name,
      bio,
      image,
      onboarded: true
    }, {
      upsert: true
    });

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update ${userId}. ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({
      id: userId
    });

    return user;

    // .populate({
    //   path: 'communities',
    //   model: Community
    // })
  } catch (error) {
    console.log(error);
    return null;
  }
}


export async function fetchUserThreads(userId: string) {
  try {
    await connectToDatabase();
    const threads = await User.findOne({
      id: userId
    })
    .populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'username image id'
        }
      }
    });
    return threads;
  } catch (error) {
    console.log(error);
    return null;
  }
}

type FetchUsersParams = {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder
}
export async function fetchUsers(params: FetchUsersParams) {
  try {
    const { userId, searchString = '', pageNumber = 1, pageSize = 20, sortBy = 'desc'} = params;

    await connectToDatabase();
    const skipAmount = (pageNumber - 1)  *  pageSize;
    const regExp = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: {
        $ne: userId
      }
    }

    if (searchString.trim() !== '') {
      query.$or = [
        { username:  {
          $regex: regExp
        }, name: {
          $regex: regExp
        }}
      ]
    }

    const sortOptions = {
      createdAt: sortBy
    }

    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);

    const total = await User.countDocuments(usersQuery);
    const users = await usersQuery.exec();
    const isNext = total > skipAmount + users.length;

    return {
      users,
      total,
      isNext,
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}


export async function fetchActivity(userId: string) {
  try {
    await connectToDatabase();

    // main threads
    const userThreads = await Thread.find({
      author: userId
    });

    // child threads
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // replies
    const replies = await Thread.find({
      _id: {
        $in: childThreadIds
      },
      author: { $ne: userId }
    }).populate({
      path: 'author',
      model: User,
      select: 'username image _id'
    });

    return replies;

  } catch (error) {
    console.log(error);
    return null;
  }
}
