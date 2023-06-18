// Get the necessary HTML elements
const timeFrameRadios = document.getElementsByName('time-frame');
const klineTypeRadios = document.getElementsByName('kline-type');
const chartCanvas = document.getElementById('chart');

// Function to fetch data from Binance and plot it on the chart
async function fetchDataAndPlot() {
  const timeFrame = getTimeFrame();
  const klineType = getKlineType();

  // Make the API request to fetch data from Binance
  const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${klineType}&limit=${timeFrame}`);

  if (!response.ok) {
    console.error('Failed to fetch data from Binance');
    return;
  }

  const data = await response.json();

  // Extract the closing prices from the data
  const closingPrices = data.map(item => parseFloat(item[4]));

  // Plot the data on the chart
  const ctx = chartCanvas.getContext('2d');
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  const chartHeight = chartCanvas.height;
  const chartWidth = chartCanvas.width;
  const barWidth = chartWidth / closingPrices.length;

  ctx.fillStyle = 'blue';

  for (let i = 0; i < closingPrices.length; i++) {
    const barHeight = (closingPrices[i] / Math.max(...closingPrices)) * chartHeight;
    const x = i * barWidth;
    const y = chartHeight - barHeight;

    ctx.fillRect(x, y, barWidth, barHeight);
  }
}

// Function to get the selected time frame
function getTimeFrame() {
  for (let i = 0; i < timeFrameRadios.length; i++) {
    if (timeFrameRadios[i].checked) {
      return timeFrameRadios[i].value;
    }
  }
}

// Function to get the selected Kline type
function getKlineType() {
  for (let i = 0; i < klineTypeRadios.length; i++) {
    if (klineTypeRadios[i].checked) {
      return klineTypeRadios[i].value;
    }
  }
}

// Add event listeners to the radio buttons
timeFrameRadios.forEach(radio => {
  radio.addEventListener('change', fetchDataAndPlot);
});

klineTypeRadios.forEach(radio => {
  radio.addEventListener('change', fetchDataAndPlot);
});

// Fetch and plot the initial data
fetchDataAndPlot();
