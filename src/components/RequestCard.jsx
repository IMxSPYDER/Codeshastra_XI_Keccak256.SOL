import { Check, XCircle } from "lucide-react"

export function RequestCard({ request, onApprove, onRevoke }) {
  return (
    <div className="flex justify-between items-center rounded-lg bg-white/5 p-4 shadow-sm">
      <div>
        <div className="font-semibold">Requester:</div>
        <div className="text-sm text-gray-400">{request.requester}</div>
        <div className="mt-2 text-sm">Credential Hash:</div>
        <div className="text-xs text-gray-500">{request.credentialHash}</div>
      </div>
      <div className="flex gap-2">
        {request.isApproved ? (
          <>
            <span className="text-green-500 flex items-center gap-1">
              <Check className="h-4 w-4" />
              Access Granted
            </span>
            <button
              onClick={() => onRevoke(request.id)}
              className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
            >
              <XCircle className="h-4 w-4" />
              Revoke
            </button>
          </>
        ) : (
          <button
            onClick={() => onApprove(request.id)}
            className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            Grant Access
          </button>
        )}
      </div>
    </div>
  )
}
