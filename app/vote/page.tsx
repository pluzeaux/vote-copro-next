import dynamic from "next/dynamic";
const VoteForm = dynamic(() => import("../../components/VoteForm"));

export default function VotePage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Vote</h2>
      <VoteForm />
    </div>
  );
}
