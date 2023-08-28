'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ThreadValidation } from '../../lib/validations/thread';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import {
  addCommentToThread,
  createThread,
} from '../../lib/actions/thread.actions';
import { Input } from '../ui/input';
import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';

type CommentFormProps = {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
};

function CommentForm(props: CommentFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { threadId = '', currentUserImg, currentUserId } = props;

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      accountId: currentUserId,
    },
  });

  async function onSubmit(values: z.infer<typeof ThreadValidation>) {
    await addCommentToThread({
      threadId,
      commentText: values.thread,
      userId: currentUserId,
      path: pathname,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  height={48}
                  width={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  className="no-focus text-light-1 outline-none"
                  placeholder="Comment..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default CommentForm;
