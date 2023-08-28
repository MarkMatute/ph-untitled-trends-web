import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '../../../../lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react';
import ProfileHeader from '../../../../components/shared/ProfileHeader';
import {
  TabsList,
  Tabs,
  TabsTrigger,
  TabsContent,
} from '../../../../components/ui/tabs';
import { profileTabs } from '../../../../constants';
import Image from 'next/image';
import ThreadsTab from '../../../../components/shared/ThreadsTab';

async function ProfilePage(params: any) {
  const { profileId } = params.params;
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const userInfo = await fetchUser(profileId);

  return (
    <section>
      <ProfileHeader
        accountId={profileId}
        authUserId={user.id}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((profileTab) => {
              return (
                <TabsTrigger
                  key={profileTab.label}
                  value={profileTab.value}
                  className="tab"
                >
                  <Image
                    src={profileTab.icon}
                    alt={profileTab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{profileTab.label}</p>

                  {profileTab.label === 'Threads' && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-light-2 !text-tiny-medium">
                      {userInfo.threads.length}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {profileTabs.map((tab) => {
            return (
              <TabsContent
                key={`content-${tab.label}`}
                value={tab.value}
                className="w-full text-light-1"
              >
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType={'User'}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}

export default ProfilePage;
