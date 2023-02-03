import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
function App() {
  const [fxRate, setFxRate] = useState(1.1);
  const [showAlert, setShowAlert] = useState(false);
  const [override, setOverride] = useState(null);
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(0);
  const [currency, setCurrency] = useState('EUR');
  const [historics, sethistorics] = useState([]);

  //we will use useEffect to handle background state
  useEffect(() => {
    const interval = setInterval(() => {
      let max =0.05;
      let min = -0.05;
      const randomNumber = Math.random() * (max - min) + min;
      setFxRate(fxRate + randomNumber);
      setShowAlert(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [fxRate]);

  useEffect(() => {
    if (!override) {
      if (Math.abs(fxRate - override) > 0.02) {
        setOverride(null);
      }
    }
  }, [fxRate, override]);

  const submitButton = e => {
    e.preventDefault();
    const rate = override || fxRate;
    const convertedAmount = currency === 'EUR' ? amount / rate : amount * rate;
    setResult(convertedAmount);
    //we add the result in our list
    sethistorics([...historics,
    {
      time: new Date().toLocaleString(),
      fxRate: rate,
      override,
      amount,
      result: convertedAmount,
      currency
    },
    ]);
  };

  const switchCurrency = () => {
    setCurrency(currency === 'EUR' ? 'USD' : 'EUR');
    setAmount(result);
  };

  return (
    <div className="container">

      <h1>Credit Agricole EUR and USD Converter </h1>

      <form onSubmit={submitButton}>
        <div>
          {showAlert && (
            <div className="alert alert-warning" role="alert">
             Real Time FX Rate:	1 EUR = {fxRate.toFixed(2)} USD
            </div>
          )}
        </div>
        <label>
          {currency === 'EUR' ? 'EUR' : 'USD'}:
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          FX Rate:
          <input
            type="number"
            placeholder="Specific FX Rate"
            value={override || ''}
            onChange={e => setOverride(e.target.value)}
          />
        </label>
        <br></br>
        <br></br>
        <div class="btn-group" role="group" aria-label="...">
          <button type="submit" class="btn btn-outline-success mr-2">Convert</button>
          <button type="button" class="btn btn-outline-warning mr-2" onClick={switchCurrency}>Switch to {currency === 'EUR' ? 'USD' : 'EUR'}</button>
        </div>

      </form>

      <h2>Result</h2>
      <div class="alert alert-success" role="alert">
        <h2>{result.toFixed(2)} {currency === 'EUR' ? 'USD' : 'EUR'}</h2>
      </div>
      <h3> The 5 last conversions</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Time</th>
            <th>Real Time FX Rate</th>
            <th>Specific FX Rate</th>
            <th>Amount</th>
            <th>Converted</th>
          </tr>
        </thead>
        <tbody>
          {historics.slice(-5).map((result, index) => (
            <tr key={index}>
              <td>{result.time}</td>
              <td>{result.fxRate}</td>
              <td>{result.override || 'N/A'}</td>
              <td>{result.amount} {result.currency}</td>
              <td>{result.result.toFixed(2)} {result.currency === 'EUR' ? 'USD' : 'EUR'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;