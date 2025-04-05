import { FileText } from "lucide-react"

export function CredentialCard({ credential }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">{credential.title || "Credential Title"}</h3>
      </div>
      <p className="text-sm text-gray-500">{credential.description || "Credential description goes here."}</p>
      <div className="mt-4 text-xs text-gray-400">Issued by: {credential.issuer || "Issuer Name"}</div>
    </div>
  )
}
