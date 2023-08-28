import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { fetchActivity, fetchUser } from '../../../lib/actions/user.actions';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

type ActivityPageProps = {};

async function ActivityPage(params: ActivityPageProps) {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const userInfo = await fetchUser(user.id);
  const activity = await fetchActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity && activity.length > 0 ? (
          <React.Fragment>
            {activity?.map((activity) => {
              return (
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  <article className="activity-card">
                    <Image
                      src={activity.author.image}
                      alt="Profile Picture"
                      height={20}
                      width={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.username}
                      </span>{' '}
                      replied to your thread.
                    </p>
                  </article>
                </Link>
              );
            })}
          </React.Fragment>
        ) : (
          <p className="!text-base-regular text-light-3">No activity.</p>
        )}
      </section>
    </section>
  );
}

export default ActivityPage;
