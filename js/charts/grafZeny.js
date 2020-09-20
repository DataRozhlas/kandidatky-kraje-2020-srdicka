const grafZeny = {
  chart: {
    type: "pie",
  },
  title: {
    text: "Zastoupení žen",
  },
  plotOptions: {
    pie: {
      animation: false,
      enableMouseTracking: false,
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b> {point.percentage:.0f} %",
        distance: "-40",
        color: "#ffffff",
       // alignTo: "connectors",
       // connectorShape: "crookedLine",
      },
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      name: "podíl mezi aktuálně zobrazenými kandidáty",
      data: [
        {
          name: "muži",
          y: 73.1,
          color: "#19B8D1",
        },
        {
          name: "ženy",
          y: 26.9,
          color: "#FF525F",
        },
      ],
    },
  ],
};

export default grafZeny;
