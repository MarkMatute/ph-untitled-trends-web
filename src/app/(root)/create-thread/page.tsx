import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '../../../lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react';
import PostThreadForm from '../../../components/forms/PostThread';

async function CreateThreadPage() {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo.onboarded) {
    return redirect('/onboarding');
  }

  return (
    <React.Fragment>
      <h1 className="head-text">Create Thread</h1>
      <PostThreadForm userId={userInfo._id.toString()} />
    </React.Fragment>
  );
}

export default CreateThreadPage;
