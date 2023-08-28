import { currentUser } from '@clerk/nextjs';
import ThreadCard from '../../../../components/cards/ThreadCard';
import { fetchUser } from '../../../../lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { fetchThreadById } from '../../../../lib/actions/thread.actions';
import CommentForm from '../../../../components/forms/Comment';

async function ThreadPage(props: any) {
  const {
    params: { id = null },
  } = props;
  if (!id) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    return redirect('/onboarding');
  }

  const thread = await fetchThreadById({
    id,
  });

  return (
    <section className="relative">
      <div>
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
      </div>

      <div className="mt-7">
        <CommentForm
          threadId={thread._id.toString()}
          currentUserId={userInfo._id.toString()}
          currentUserImg={userInfo.image}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((comment: any) => {
          return (
            <ThreadCard
              key={comment._id}
              id={comment._id}
              currentUserId={comment.id || ''}
              parentId={comment.parentId}
              content={comment.text}
              author={comment.author}
              community={comment.community}
              createdAt={comment.createdAt}
              comments={comment.comments}
              isComment={Boolean(comment.parentId)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ThreadPage;
