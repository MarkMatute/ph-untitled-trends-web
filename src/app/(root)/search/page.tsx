import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { fetchUser, fetchUsers } from '../../../lib/actions/user.actions';
import React from 'react';
import UserCard from '../../../components/cards/UserCard';

type SearchPageProps = {};

async function SearchPage(params: SearchPageProps) {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo.onboarded) {
    redirect('/onboarding');
  }

  const result = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mt-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {result && result.users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          <React.Fragment>
            {result?.users.map((person) => {
              return (
                <UserCard
                  key={person.id}
                  id={person.id}
                  username={person.username}
                  imgUrl={person.image}
                  bio={person.bio}
                  personType="User"
                />
              );
            })}
          </React.Fragment>
        )}
      </div>
    </section>
  );
}

export default SearchPage;
