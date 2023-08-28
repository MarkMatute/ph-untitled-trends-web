import { fetchUserThreads } from '../../lib/actions/user.actions';
import ThreadCard from '../cards/ThreadCard';

type ThreadsTabProps = {
  currentUserId: string;
  accountId: string;
  accountType: string;
};

async function ThreadsTab(props: ThreadsTabProps) {
  const { currentUserId, accountId, accountType } = props;
  const results = await fetchUserThreads(accountId);
  return (
    <section className="mt-9 flex flex-col gap-10">
      {results.threads.map((thread: any) => {
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === 'User'
                ? {
                    username: results.username,
                    image: results.image,
                    id: results.id,
                  }
                : {
                    username: thread.author.username,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        );
      })}
    </section>
  );
}

export default ThreadsTab;
