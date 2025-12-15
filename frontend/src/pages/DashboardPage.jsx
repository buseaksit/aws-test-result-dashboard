import React, { useEffect, useState } from "react";
import { fetchTestRuns } from "../api/apiClient";   // your existing import
import { Link } from "react-router-dom";

// 🟦 Environment color helper (ADD HERE)
function environmentColor(env) {
  const upper = (env || "").toUpperCase();

  if (upper === "PROD") return "#dc2626";   // red
  if (upper === "STG") return "#fbbf24";    // yellow
  if (upper === "QA") return "#0ea5e9";     // blue

  return "#6b7280"; // gray default
}

// 🟦 Date formatter you already use
function formatDateTime(iso) {
  if (!iso || iso === "Unknown time") return "Unknown time";

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

export default function DashboardPage() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const raw = await fetchTestRuns();

        const normalized = raw.map((item, index) => ({
          id: item.test_run_id || `TR-${index + 1}`,
          name: item.suite_name || "Unnamed Suite",
          status: (item.status || "UNKNOWN").toUpperCase(),
          startedAt: item.created_at || "Unknown time",
          total: item.total_tests || 0,
          passed: item.passed || 0,
          failed: item.failed || 0,
          environment: item.environment || "unknown",
          triggeredBy: item.triggered_by || "unknown",
        }));

        // Sort newest first
        normalized.sort((a, b) => {
          if (a.startedAt === "Unknown time") return 1;
          if (b.startedAt === "Unknown time") return -1;
          return b.startedAt.localeCompare(a.startedAt);
        });

        setRuns(normalized);
      } catch (err) {
        setError(err.message || "Failed to load test runs");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Test Results Dashboard</h1>

      {loading && <p>Loading test runs…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table className="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Suite</th>
              <th>Status</th>
              <th>Env</th> {/* ⭐ NEW COLUMN */}
              <th>Started</th>
              <th>Total</th>
              <th>Passed</th>
              <th>Failed</th>
            </tr>
          </thead>

          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td>
                  <Link
                    to={`/test-run/${encodeURIComponent(run.id)}`}
                    style={{ color: "#38bdf8", textDecoration: "none" }}
                  >
                 {run.id}
                 </Link>
                </td>

                <td>{run.name}</td>

                <td>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "999px",
                      backgroundColor:
                        run.status === "PASSED"
                          ? "#22c55e"
                          : run.status === "FAILED"
                          ? "#ef4444"
                          : "#6b7280",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {run.status}
                  </span>
                </td>

                {/* ⭐ NEW ENVIRONMENT BADGE */}
                <td>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "999px",
                      backgroundColor: environmentColor(run.environment),
                      color: "black",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    {run.environment}
                  </span>
                </td>

                <td>{formatDateTime(run.startedAt)}</td>
                <td>{run.total}</td>
                <td>{run.passed}</td>
                <td>{run.failed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
