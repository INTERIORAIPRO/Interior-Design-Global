import { Link } from "@/i18n/navigation";
import type { ReturnRequest } from "@/lib/returns/types";

export function ReturnsOverview({ requests }: { requests: ReturnRequest[] }) {
  return (
    <ul className="space-y-3">
      {requests.map((request) => (
        <li key={request.id}>
          <Link
            href={`/returns/${request.id}`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-brass/40"
          >
            <div>
              <p className="font-medium">{request.id}</p>
              <p className="text-sm text-linen/55">
                Order {request.orderId} · {request.reason}
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-brass">
              {request.status}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
