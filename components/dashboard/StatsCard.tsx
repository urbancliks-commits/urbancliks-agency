export function StatsCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        {label}
      </p>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
