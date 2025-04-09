
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        status === "pending" && "bg-yellow-100 text-yellow-800",
        status === "approved" && "bg-green-100 text-green-800",
        status === "rejected" && "bg-red-100 text-red-800"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
