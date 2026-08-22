import { PageHeader } from "@/components/PageHeader";

import { DeletePostForm } from "./DeletePostForm";

export default function PostsPage() {
  return (
    <>
      <PageHeader title="Posts" description="Content moderation actions." />
      <div className="p-8">
        <DeletePostForm />
      </div>
    </>
  );
}
