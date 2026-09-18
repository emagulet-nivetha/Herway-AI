import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card } from "@/components/ui/Display";
import { formatCurrency } from "@/utils/helpers";

const COLORS = ["#7047A8", "#168C87", "#E9A7B8", "#9A6BD8", "#3FB2AC", "#5B3A8E"];

export function ChartCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-charcoal">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-charcoal-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid rgba(36,36,36,0.1)",
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
};

export function SavingsAreaChart({ data }: { data: { month: string; amount: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="dash-savings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7047A8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#7047A8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,36,36,0.06)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#6B6B6B" />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="#6B6B6B"
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="amount" stroke="#7047A8" strokeWidth={2.5} fill="url(#dash-savings)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RepaymentPie({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? "#168C87" : "#E9A7B8"} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ContributionBarChart({ data }: { data: { month: string; amount: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,36,36,0.06)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#6B6B6B" />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="#6B6B6B"
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
          <Bar dataKey="amount" fill="#7047A8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillDistributionChart({ data }: { data: { skill: string; count: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,36,36,0.06)" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} stroke="#6B6B6B" />
          <YAxis
            type="category"
            dataKey="skill"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="#6B6B6B"
            width={110}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SalesLineChart({ data }: { data: { name: string; sales: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,36,36,0.06)" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="#6B6B6B" interval={0} angle={-12} textAnchor="end" height={60} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#6B6B6B" />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="sales" stroke="#168C87" strokeWidth={2.5} dot={{ r: 4, fill: "#168C87" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { COLORS };