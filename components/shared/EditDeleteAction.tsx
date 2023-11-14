import Link from "next/link";

interface EditDeleteActionProps {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  return (
    <div className="flex gap-5">
      <Link href={`/edit/${type.toLowerCase()}/${itemId}`}>
        <button className="btn btn-secondary">Edit</button>
      </Link>
      <button className="btn btn-secondary">Delete</button>
    </div>
  );
};

export default EditDeleteAction;
