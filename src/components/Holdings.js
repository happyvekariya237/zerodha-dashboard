import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://zerodha-backend-lobs.onrender.com/allHoldings")
      .then((res) => setAllHoldings(res.data))
      .catch((err) => {
        console.error("Failed to fetch holdings:", err);
        setError("Could not load holdings");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading holdings...</p>;
  if (error) return <p>{error}</p>;

  const labels = allHoldings.map((stock) => stock.name ?? "-");
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price ?? 0),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = (stock.price ?? 0) * (stock.qty ?? 0);
              const isProfit = curValue - (stock.avg ?? 0) * (stock.qty ?? 0) >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name ?? "-"}</td>
                  <td>{stock.qty ?? 0}</td>
                  <td>{(stock.avg ?? 0).toFixed(2)}</td>
                  <td>{(stock.price ?? 0).toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{(curValue - (stock.avg ?? 0) * (stock.qty ?? 0)).toFixed(2)}</td>
                  <td className={profClass}>{stock.net ?? 0}</td>
                  <td className={dayClass}>{stock.day ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
