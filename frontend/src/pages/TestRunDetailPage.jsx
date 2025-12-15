import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTestRuns } from "../api/apiClient";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const STATUS_COLORS = {
  PASSED: "#22c55e",
  FAILED: "#ef4444",
  RUNNING: "#f97316",
};

const PIE_COLORS = ["#22c55e", "#ef4444"]; // passed, failed

function statusColor(status) {
  const upper = (status || "").toUpperCase();
  return STATUS_COLORS[upper] || "#6b7280";
}

function environmentColor(env) {
  const upper = (env || "").toUpperCase();

  if (upper === "PROD") return "#dc2626";   // red
  if (upper === "STG") return "#fbbf24";    // yellow
  if (upper === "QA") return "#0ea5e9";     // blue

  return "#6b7280"; // gray default
}

function formatDateTime(iso) {
  if (!iso) return "Unknown time";

  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Unknown time";

  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TestRunDetailPage() {
  const { id } = useParams();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // reuse existing endpoint: /test-runs
        const all = await fetchTestRuns();

        // find by test_run_id first (this is what we used as ID in the table)
        const found =
          all.find((r) => r.test_run_id === id) ||
          all.find((r, index) => `TR-${index + 1}` === id); // fallback

        if (!found) {
          setError("Test run not found");
        } else {
          setRun(found);
        }
      } catch (err) {
        setError(err.message || "Failed to load test run");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <p style={{ color: "#e5e7eb" }}>Loading test run...</p>
      </PageWrapper>
    );
  }

  if (error || !run) {
    return (
      <PageWrapper>
        <LinkBack />
        <p style={{ color: "#fca5a5", marginTop: "1.5rem" }}>❌ {error}</p>
      </PageWrapper>
    );
  }

  const total = run.total_tests ?? 0;
  const passed = run.passed ?? 0;
  const failed = run.failed ?? 0;
  const environment = run.environment || "unknown";
  const status = (run.status || "UNKNOWN").toUpperCase();

  const pieData =
    passed === 0 && failed === 0
      ? []
      : [
          { name: "Passed", value: passed },
          { name: "Failed", value: failed },
        ];

  return (
    <PageWrapper>
      <LinkBack />

      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          marginTop: "1.25rem",
          marginBottom: "0.25rem",
        }}
      >
        Test Run Details
      </h1>

      <p style={{ color: "#9ca3af", marginBottom: "1.75rem" }}>
        ID: {run.test_run_id}
      </p>

      {/* Top summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <SummaryCard label="Total Tests" value={total} />
        <SummaryCard label="Passed" value={passed} />
        <SummaryCard label="Failed" value={failed} />
        <SummaryCard
          label="Status"
          value={status}
          pillColor={statusColor(status)}
        />
      </div>

      {/* Middle section: chart + meta */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
          gap: "1.5rem",
          alignItems: "flex-start",
        }}
      >
        {/* Left: meta info */}
        <div
          style={{
            padding: "1.25rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            background:
              "radial-gradient(circle at top left, rgba(148,163,184,0.15), transparent 55%) #020617",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            Run Information
          </h2>

          <DetailRow label="Suite Name" value={run.suite_name || "N/A"} />
          <DetailRow
            label="Environment"
            value={
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "999px",
                  backgroundColor: environmentColor(environment),
                  color: "black",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {environment}
              </span>
            }
          />
          <DetailRow
            label="Triggered By"
            value={run.triggered_by || "Unknown"}
          />
          <DetailRow
            label="Started At"
            value={formatDateTime(run.created_at)}
          />
          <DetailRow label="Status">
            <span
              style={{
                padding: "3px 8px",
                borderRadius: "999px",
                backgroundColor: statusColor(status),
                color: "white",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {status}
            </span>
          </DetailRow>
          <DetailRow label="Test Run ID" value={run.test_run_id} />
        </div>

        {/* Right: pie chart */}
        <div
          style={{
            padding: "1.25rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            background:
              "radial-gradient(circle at top right, rgba(52,211,153,0.12), transparent 55%) #020617",
            height: "100%",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            Pass / Fail Breakdown
          </h2>

          {pieData.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              No pass/fail data available for this run.
            </p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1f2937",
                      borderRadius: 8,
                      color: "#e5e7eb",
                      fontSize: "0.85rem",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

function PageWrapper({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        padding: "1.75rem 2rem",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function LinkBack() {
  return (
    <Link
      to="/"
      style={{
        color: "#38bdf8",
        fontSize: "0.95rem",
        textDecoration: "none",
      }}
    >
      ← Back to dashboard
    </Link>
  );
}

function SummaryCard({ label, value, pillColor }) {
  const isPill = pillColor != null;

  return (
    <div
      style={{
        padding: "0.9rem 1rem",
        borderRadius: "0.75rem",
        border: "1px solid #1f2937",
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.2), transparent 60%) #020617",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#9ca3af",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </div>
      {isPill ? (
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "999px",
            backgroundColor: pillColor,
            color: "white",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          {value}
        </span>
      ) : (
        <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>{value}</div>
      )}
    </div>
  );
}

function DetailRow({ label, value, children }) {
  const content = value ?? children;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: "0.55rem",
        fontSize: "0.9rem",
      }}
    >
      <span style={{ color: "#9ca3af" }}>{label}</span>
      <span style={{ color: "#e5e7eb", textAlign: "right" }}>{content}</span>
    </div>
  );
}
