import React from 'react';
import { fetchThreads } from '../../lib/actions/thread.actions';
import ThreadCard from '../../components/cards/ThreadCard';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const result = await fetchThreads({
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <React.Fragment>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result && result.threads.length === 0 ? (
          <p>No threads</p>
        ) : (
          result?.threads.map((thread) => {
            return (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user.id}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.comments}
                isComment={Boolean(thread.parentId)}
              />
            );
          })
        )}
      </section>
    </React.Fragment>
  );
}
