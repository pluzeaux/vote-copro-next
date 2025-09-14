import dynamic from "next/dynamic";
const VoteFormFinal = dynamic(() => import("@/components/VoteForm"));

export default function VotePage() {
  return (
    <div w-140>
      <h2 className="text-2xl font-semibold mb-4">Vote</h2>
      <VoteFormFinal />
    </div>
  );
}
