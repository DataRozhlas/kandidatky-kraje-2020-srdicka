const grafZeny = {
  chart: {
    type: "pie",
  },
  title: {
    text: "Zastoupení žen",
    style: {
      fontFamily: "Asap",
      fontWeight: "bold",
      fontSize: "1rem"
    }
  },
  plotOptions: {
    pie: {
      animation: false,
      enableMouseTracking: false,
      dataLabels: {
        enabled: true,
        format: "{point.name}<br>{point.percentage:.0f} %",
        distance: "-40",
        color: "#fff",
        style: {
          textOutline: false,
          fontFamily: "Asap",
          fontSize: ".9rem",
          fontWeight: "normal"  
        }
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
          color: "#337CD7",
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
