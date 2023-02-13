import {useState, useEffect, useRef} from 'react';
import './App.css';
import CurrencyInput from './CurrencyInput';
import axios from 'axios';
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const App = () => {

  const [amountCurrent, setAmountCurrent] = useState(1);
  const [amountTarget, setAmountTarget] = useState(1);
  const [currencyCurrent, setCurrencyCurrent] = useState('USD');
  const [currencyTarget, setCurrencyTarget] = useState('AUD');
  const [rates, setRates] = useState([]);
  const [currenciesSeries, setCurrenciesSeries] = useState([2, 5, 3, 4, 6, 9]);
  const [dataSeries, setDataSeries] = useState([]);

  // const xValues = ["January", "February", "March", "April", "May", "June", "January", "February", "March", "April", "May", "June"];

  const currenciesData = {
    labels: dataSeries,
    datasets: [
      {
        label: "Time-Series Endpoint",
        backgroundColor: "red",
        borderColor: "red",
        data: currenciesSeries,
      },
    ],
  };

  console.log(Date.now());

  useEffect(() => {
    axios.get('https://api.apilayer.com/fixer/latest?base=USD&apikey=BMJFqnXMPMOSAqhVT8jGEbdpZ2zHjxLf')
      .then(response => {
        console.log(response.data.rates);
        setRates(response.data.rates);
      })
  }, []);

  useEffect(() => {
    axios.get('https://api.apilayer.com/fixer/timeseries?apikey=BMJFqnXMPMOSAqhVT8jGEbdpZ2zHjxLf&start_date=2022-02-08&end_date=2023-02-08&base=USD')
      .then(response => {
        const arrayCurrency = [];
        const dataArray = [];
        for (const [key, value] of Object.entries(response.data.rates)) {
          console.log(`${key}: ${value.AUD}`);
          arrayCurrency.push(value.AUD);
          dataArray.push(key);
        }
        setCurrenciesSeries(arrayCurrency);
        setDataSeries(dataArray);
        console.log(response.data.rates);
      })
  }, []);



  // useEffect(() => {
  //   axios.get('https://api.apilayer.com/fixer/2013-12-24?apikey=BMJFqnXMPMOSAqhVT8jGEbdpZ2zHjxLf&base=USD')
  //     .then(response => {
  //       console.log(response);
  //     })
  // }, []);

  useEffect(() => {
    if (!!rates) {
      const init = () => {
        handleAmountFirstChange(1);
      };
      init();
    }
  }, [rates]);

  const format = (number) => {
    return number.toFixed(6);
  };

  const handleAmountFirstChange = (amountCurrent) => {
    setAmountTarget(format(parseInt(amountCurrent) * rates[currencyTarget] / rates[currencyCurrent]));
    setAmountCurrent(amountCurrent);

  };

  const handleCurrency1Change = (currencyCurrent) => {
    setAmountTarget(format(parseInt(amountCurrent) * rates[currencyTarget] / rates[currencyCurrent]));
    setCurrencyCurrent(currencyCurrent);
  };

  const handleAmountSecondChange = (amountTarget) => {
    setAmountCurrent(format(parseInt(amountTarget) * rates[currencyCurrent] / rates[currencyTarget]));
    setAmountTarget(amountTarget);
  };

  const handleCurrencyTargetChange = (currencyTarget) => {
    setAmountCurrent(format(parseInt(amountTarget) * rates[currencyCurrent] / rates[currencyTarget]));
    setCurrencyTarget(currencyTarget);
    // setCurrenciesSeries(currencyTarget)
  };

  // const myChart = useRef(null);
  //
  // const xValues = [100,200,300,400,500,600,700,800,900,1000];
  //
  // new Chart("myChart", {
  //   type: "line",
  //   data: {
  //     labels: xValues,
  //     datasets: [{
  //       data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
  //       borderColor: "red",
  //       fill: false
  //     }, {
  //       data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
  //       borderColor: "green",
  //       fill: false
  //     }, {
  //       data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
  //       borderColor: "blue",
  //       fill: false
  //     }]
  //   },
  //   options: {
  //     legend: {display: false}
  //   }
  // });

  return (
    <div>
      <h1>Currency Converter</h1>
      <CurrencyInput
        onAmountChange={handleAmountFirstChange}
        onCurrencyChange={handleCurrency1Change}
        currencies={Object.keys(rates)}
        amount={amountCurrent}
        currency={currencyCurrent}
      />
      <CurrencyInput
        onAmountChange={handleAmountSecondChange}
        onCurrencyChange={handleCurrencyTargetChange}
        currencies={Object.keys(rates)}
        amount={amountTarget}
        currency={currencyTarget}
      />
      {/*<h1>Time-Series Endpoint</h1>*/}
      {/*<CurrencyInput*/}
        {/*onAmountChange={handleAmountFirstChange}*/}
        {/*onCurrencyChange={handleCurrency1Change}*/}
        {/*currencies={Object.keys(rates)}*/}
        {/*amount={amountCurrent}*/}
        {/*currency={currencyCurrent}*/}
      {/*/>*/}
      {/*<CurrencyInput*/}
        {/*onAmountChange={handleAmountSecondChange}*/}
        {/*onCurrencyChange={handleCurrencyTargetChange}*/}
        {/*currencies={Object.keys(rates)}*/}
        {/*amount={amountTarget}*/}
        {/*currency={currencyTarget}*/}
      {/*/>*/}
      <Line data={currenciesData} />
      {/*<canvas id='myChart' style={{width:'70%'}}></canvas>*/}
    </div>
  );
};

export default App;
