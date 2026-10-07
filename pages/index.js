import { useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [chartType, setChartType] = useState("bar");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsedData = results.data.map((row) => {
          const convertedRow = {};

          Object.keys(row).forEach((key) => {
            const value = row[key];

            if (value !== "" && !isNaN(value)) {
              convertedRow[key] = Number(value);
            } else {
              convertedRow[key] = value;
            }
          });

          return convertedRow;
        });

        setData(parsedData);

        if (parsedData.length > 0) {
          const columnNames = Object.keys(parsedData[0]);

          setColumns(columnNames);
          setXColumn(columnNames[0]);

          if (columnNames.length > 1) {
            setYColumn(columnNames[1]);
          }
        }
      },
    });
  };

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "auto",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>Jassiris's AI Data Visualization Dashboard</h1>

      <p>
        Upload a CSV file to explore your data and create visualizations.
      </p>

      <div
        style={{
          padding: "25px",
          backgroundColor: "#f4f4f4",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h2>1. Upload Your Dataset</h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </div>

      {data.length > 0 && (
        <>
          <div
            style={{
              padding: "25px",
              backgroundColor: "#f4f4f4",
              borderRadius: "12px",
              marginBottom: "30px",
            }}
          >
            <h2>2. Dataset Preview</h2>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column}
                        style={{
                          border: "1px solid #ccc",
                          padding: "10px",
                        }}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td
                          key={column}
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                          }}
                        >
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              padding: "25px",
              backgroundColor: "#f4f4f4",
              borderRadius: "12px",
              marginBottom: "30px",
            }}
          >
            <h2>3. Create Visualization</h2>

            <label>
              X Axis:
              <select
                value={xColumn}
                onChange={(e) => setXColumn(e.target.value)}
                style={{ margin: "10px" }}
              >
                {columns.map((column) => (
                  <option key={column}>{column}</option>
                ))}
              </select>
            </label>

            <label>
              Y Axis:
              <select
                value={yColumn}
                onChange={(e) => setYColumn(e.target.value)}
                style={{ margin: "10px" }}
              >
                {columns.map((column) => (
                  <option key={column}>{column}</option>
                ))}
              </select>
            </label>

            <label>
              Chart:
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                style={{ margin: "10px" }}
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </label>
          </div>

          <div
            style={{
              height: "450px",
              padding: "25px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,.1)",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xColumn} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={yColumn} fill="#4f46e5" />
                </BarChart>
              ) : (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xColumn} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={yColumn}
                    stroke="#4f46e5"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </>
      )}
    </main>
  );
}