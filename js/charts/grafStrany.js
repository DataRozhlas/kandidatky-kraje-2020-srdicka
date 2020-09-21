const grafStrany = {
  chart: {
    type: "bar",
  },
  title: {
    text: "Strany s nejvíce kandidáty",
    style: {
      fontFamily: "Asap",
      fontWeight: "bold",
      fontSize: "1rem"
    }
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
    labels: {
      style: {
        fontFamily: "Asap",
        fontSize: "0.85rem"
      }
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "počet kandidátů",
      style: {
        fontFamily: "Asap",
        fontSize: "0.85rem"
      }
    },
    labels: {
      style: {
        fontFamily: "Asap",
        fontSize: "0.85rem"
      }
    },
    allowDecimals: false
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Asap",
          fontSize: "0.85rem"
        }
      },
      animation: false,
      groupPadding: 0,
      shadow: false,
      enableMouseTracking: false,
      // pointWidth: 14,
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
