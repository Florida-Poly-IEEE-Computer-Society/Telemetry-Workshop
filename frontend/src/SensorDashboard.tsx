import { useState, useEffect } from "react";
import LineDataset from "./chart.tsx";

export interface SensorReading {
  temperature: number;
  humidity: number;
  status: "normal" | "warning" | "critical";
}

const statusConfig = {
  normal: { color: "#00ff9d", label: "NOMINAL", glow: "0 0 20px rgba(0,255,157,0.4)" },
  warning: { color: "#ffd600", label: "WARNING", glow: "0 0 20px rgba(255,214,0,0.4)" },
  critical: { color: "#ff3d3d", label: "CRITICAL", glow: "0 0 20px rgba(255,61,61,0.4)" },
};

export default function SensorDashboard() {
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dataSet, setDataSet] = useState<{ [key: string]: any }[]>(Array(10).fill({
    timestamp: new Date(), temperature: null, humidity: null
  }))


  useEffect(() => {
    setMounted(true);

    fetch("http://localhost:8000/current")
      .then((res) => res.json())
      .then((data: SensorReading) => setCurrentReading(data))
      .catch(console.error);

    const eventSource = new EventSource("http://localhost:8000/stream");
    eventSource.addEventListener("sensor_update", (event: MessageEvent) => {
      const example: SensorReading = JSON.parse(event.data)
      setCurrentReading(example);
      setDataSet(d => d.slice(1).concat([{ timestamp: new Date(), temperature: example.temperature, humidity: example.humidity }])
      )
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const status = currentReading ? statusConfig[currentReading.status] : null;

  return (
    <div className="overall-root">
      <div className="sd-root">
        <header className={mounted ? "sd-header-1" : "sd-header-0"}>
          <p className="sd-eyebrow">Live Telemetry Feed</p>
          <h1 className="sd-title">Sensor Dashboard</h1>
          <div className="sd-divider" />
        </header>

        <div className="sd-grid">
          {/* Temperature */}
          <div className={mounted ? "sd-card-1 sd-card sd-card-delay-1" : "sd-card-0  sd-card  sd-card-delay-1"}>
            <div className="sd-corner sd-corner-tl" />
            <div className="sd-corner sd-corner-br" />
            <p className="sd-card-label">Temperature</p>
            {currentReading ? (
              <p className="sd-value">
                {currentReading.temperature.toFixed(1)}
                <span className="sd-unit">°C</span>
              </p>
            ) : (
              <div className="sd-skeleton" style={{ height: "3.2rem", width: "60%" }} />
            )}
          </div>

          {/* Humidity */}
          <div className={mounted ? "sd-card-1 sd-card sd-card-delay-2" : "sd-card-0  sd-card  sd-card-delay-2"}>
            <div className="sd-corner sd-corner-tl" />
            <div className="sd-corner sd-corner-br" />
            <p className="sd-card-label">Humidity</p>
            {currentReading ? (
              <p className="sd-value">
                {currentReading.humidity.toFixed(1)}
                <span className="sd-unit">%</span>
              </p>
            ) : (
              <div className="sd-skeleton" style={{ height: "3.2rem", width: "55%" }} />
            )}
          </div>

          {/* Status */}
          <div className={mounted ? "sd-card-1 sd-card sd-card-delay-3" : "sd-card-0  sd-card  sd-card-delay-3"}>
            <div className="sd-corner sd-corner-tl" />
            <div className="sd-corner sd-corner-br" />
            <p className="sd-card-label">System Status</p>
            {currentReading && status ? (
              <span
                className="sd-status-badge"
                style={{
                  color: status.color,
                  borderColor: status.color,
                  boxShadow: status.glow,
                  background: `${status.color}0d`,
                }}
              >
                <span
                  className="sd-status-dot"
                  style={{ background: status.color }}
                />
                {status.label}
              </span>
            ) : (
              <div className="sd-skeleton" style={{ height: "2rem", width: "45%" }} />
            )}
          </div>
        </div>

        <p className="sd-footer">
          sys:active &nbsp;·&nbsp; stream:sse &nbsp;·&nbsp; src:localhost:8000
        </p>
      </div>
      <LineDataset dataSet={dataSet} />
    </div>
  );
}
