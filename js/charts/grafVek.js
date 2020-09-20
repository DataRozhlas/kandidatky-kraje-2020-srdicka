const grafVek = {
  chart: {
    type: "column",
  },
  title: {
    text: "Věk – průměrně 48 let",
  },
  xAxis: {
    categories: [
      "do 20 let",
      "20-29",
      "30-39",
      "40-49",
      "50-59",
      "60-69",
      "70-79",
      "80 a víc",
    ],
  },
  yAxis: {
    min: 0,
    title: {
      text: "",
    },
  },
  plotOptions: {
    column: {
      animation: false,
      pointPadding: 0.12,
      borderWidth: 0,
      groupPadding: 0,
      shadow: false,
      enableMouseTracking: false,
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      name: "věk",
      color: "#5799CF",
      showInLegend: false,
      data: [51, 772, 1612, 2799, 2525, 1512, 421, 34],
    },
  ],
};

export default grafVek;
