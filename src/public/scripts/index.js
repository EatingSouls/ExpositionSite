var io = io(window.location.origin);

io.on("ping", (data) => {
    var v = new Date();
    addData(v.getHours() +":"+ v.getMinutes() + ":" + v.getSeconds(), data.val.toFixed(2));
});

const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Purezza aria',
      data: [],
      borderColor: '#3375F6',
      pointBorderColor: "#FFFFFF",
      borderWidth: 2,
    }]
  },
  options: {
    animation: false,
    scales: {
      y: {
        grid: {
          color: "#515962",
          beginAtZero: true
        }
      },
      x: {
        grid: {
          color: "#515962"
        }
      },
      myScale: {
        type: 'logarithmic',
        position: 'right', // `axis` is determined by the position as `'y'`
      }
    }  
  }
});

const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

function addData(label, data) {
  if(myChart.data.labels.length > 50){
      removeData(myChart);
  }
  myChart.data.labels.push(label);
  myChart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
  });
  myChart.update();
}

function removeData(chart) {
  chart.data.labels.shift();
  chart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
  });
  chart.update();
}