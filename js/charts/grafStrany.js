const grafStrany = {
  chart: {
    type: "bar",
  },
  title: {
    text: "Nejvíc kandidátů",
  },
  xAxis: {
    categories: [
      "SPD",
      "ANO",
      "KSČM",
      "Piráti",
      "Trikolóra",
      "ČSSD",
      "Rozumní",
      "ODS",
    ],
  },
  yAxis: {
    min: 0,
    title: {
      text: "počet kandidátů",
    },
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
      },
      animation: false,
      groupPadding: 0,
      shadow: false,
      enableMouseTracking: false,
      pointWidth: 14,
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      name: "kandidáti",
      color: "#6464A8",
      showInLegend: false,
      data: [740, 734, 729, 671, 576, 573, 538, 350, ],
    },
  ],
};

export default grafStrany;
