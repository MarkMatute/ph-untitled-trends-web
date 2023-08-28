'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type UserCardProps = {
  id: string;
  username: string;
  imgUrl: string;
  personType: string;
  bio: string;
};

function UserCard(params: UserCardProps) {
  const router = useRouter();

  const { id, username, imgUrl, personType, bio } = params;
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semi-bold text-light-1">{username}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button
        className="user-card_btn"
        onClick={() => router.push(`/profile/${id}`)}
      >
        View
      </Button>
    </article>
  );
}

export default UserCard;
