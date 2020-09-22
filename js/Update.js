//import Highcharts from "highcharts";
import grafZeny from "./charts/grafZeny";
import grafVek from "./charts/grafVek";
import grafStrany from "./charts/grafStrany";

const MSGS = {
  SEARCH_TERM: "SEARCH_TERM",
  VYBRANY_KRAJ: "VYBRANY_KRAJ",
  VYBRANA_STRANA: "VYBRANA_STRANA",
  CURR_PAGE: "CURR_PAGE",
  SRDICKO: "SRDICKO",
  ZRUSIT_VYBER: "ZRUSIT_VYBER",
};

export function zrusit(id) {
  return {
    type: MSGS.ZRUSIT_VYBER,
    id,
  };
}

export function srdicko(id) {
  return {
    type: MSGS.SRDICKO,
    id,
  };
}

export function searchTermInput(searchTerm) {
  return {
    type: MSGS.SEARCH_TERM,
    searchTerm,
  };
}

export function vyberKraj(vybranyKraj) {
  return {
    type: MSGS.VYBRANY_KRAJ,
    vybranyKraj,
  };
}

export function vyberStranu(vybranaStrana) {
  return {
    type: MSGS.VYBRANA_STRANA,
    vybranaStrana,
  };
}

export function zmenStranku(currPage) {
  return {
    type: MSGS.CURR_PAGE,
    currPage,
  };
}

function sumVisible(acc, kandidat) {
  return acc + (kandidat.s + kandidat.f + kandidat.q === 3 ? 1 : 0);
}

//grafy
function prekresliGrafZen(kandidati, zobrazujiKandidatu, cisloGrafu) {
  if (zobrazujiKandidatu > 0) {
    document.getElementById(`graf-zeny-${cisloGrafu}`).classList.remove("dn");
    const vybraniKandidati = kandidati.filter((k) =>
      cisloGrafu === "1" ? k.s === 1 && k.f === 1 && k.q === 1 : true
    );
    const pocetZen = vybraniKandidati.reduce((acc, kandidat) => {
      return acc + (kandidat.p.slice(-1) === "á" ? 1 : 0);
    }, 0);
    grafZeny.series[0].data[1].y = (pocetZen / zobrazujiKandidatu) * 100;
    grafZeny.series[0].data[0].y = 100 - (pocetZen / zobrazujiKandidatu) * 100;
   // Highcharts.chart(`graf-zeny-${cisloGrafu}`, grafZeny);
  } else {
    document.getElementById(`graf-zeny-${cisloGrafu}`).classList.add("dn");
  }
}

function prekresliGrafVeku(kandidati, zobrazujiKandidatu, cisloGrafu) {
  if (zobrazujiKandidatu > 0) {
    document.getElementById(`graf-vek-${cisloGrafu}`).classList.remove("dn");
    const vybraniKandidati = kandidati.filter((k) =>
      cisloGrafu === "1" ? k.s === 1 && k.f === 1 && k.q === 1 : true
    );
    const ageGroups = vybraniKandidati.reduce(
      (acc, kandidat) => {
        if (kandidat.v < 20) {
          acc[0] = acc[0] + 1;
          return acc;
        } else if (kandidat.v < 30) {
          acc[1] = acc[1] + 1;
          return acc;
        } else if (kandidat.v < 40) {
          acc[2] = acc[2] + 1;
          return acc;
        } else if (kandidat.v < 50) {
          acc[3] = acc[3] + 1;
          return acc;
        } else if (kandidat.v < 60) {
          acc[4] = acc[4] + 1;
          return acc;
        } else if (kandidat.v < 70) {
          acc[5] = acc[5] + 1;
          return acc;
        } else if (kandidat.v < 80) {
          acc[6] = acc[6] + 1;
          return acc;
        } else {
          acc[7] = acc[7] + 1;
          return acc;
        }
      },
      [0, 0, 0, 0, 0, 0, 0, 0]
    );
    const celkVek = vybraniKandidati.reduce((acc, kandidat) => {
      return acc + kandidat.v;
    }, 0);
    grafVek.series[0].data = ageGroups;
    grafVek.title.text = `Věk – průměrně ${Math.round(
      celkVek / zobrazujiKandidatu
    )} let`;
 //   Highcharts.chart(`graf-vek-${cisloGrafu}`, grafVek);
  } else {
    document.getElementById(`graf-vek-${cisloGrafu}`).classList.add("dn");
  }
}

function prekresliGrafStran(strany, kandidati, zobrazujiKandidatu, cisloGrafu) {
    if (zobrazujiKandidatu > 0) {
    document.getElementById(`graf-strany-${cisloGrafu}`).classList.remove("dn");
    const vybraniKandidati = kandidati.filter((k) =>
      cisloGrafu === "1" ? k.s === 1 && k.f === 1 && k.q === 1 : true
    );
    const stranyPocty = strany.map((s) => {
      const kandidatiZaStranu = vybraniKandidati.reduce((acc, kandidat) => {
        if (kandidat.k === s.k) {
          acc = acc + 1;
          return acc;
        } else {
          return acc;
        }
      }, 0);
      return { s: s.nk, k: kandidatiZaStranu };
    });
    stranyPocty.sort((a, b) => parseFloat(b.k) - parseFloat(a.k));
    const vysledek = stranyPocty.slice(0, 8).filter((s) => s.k > 0);
    grafStrany.series[0].data = vysledek.map((v) => v.k);
    grafStrany.xAxis.categories = vysledek.map((v) => v.s);
  //  Highcharts.chart(`graf-strany-${cisloGrafu}`, grafStrany);
  } else {
    document.getElementById(`graf-strany-${cisloGrafu}`).classList.add("dn");
  }
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SEARCH_TERM: {
      const { searchTerm } = msg;
      const kandidati = model.kandidati.map((k) => {
        const hledane = searchTerm.toUpperCase();
        if (
          k.p.toUpperCase().indexOf(hledane) > -1 ||
          k.j.toUpperCase().indexOf(hledane) > -1 ||
          k.po.toUpperCase().indexOf(hledane) > -1 ||
          k.b.toUpperCase().indexOf(hledane) > -1
        ) {
          return { ...k, s: 1 };
        } else return { ...k, s: 0 };
      });
      const zobrazujiKandidatu = kandidati.reduce(sumVisible, 0);
      // překresli grafy
      prekresliGrafZen(kandidati, zobrazujiKandidatu, "1");
      prekresliGrafVeku(kandidati, zobrazujiKandidatu, "1");
      prekresliGrafStran(model.strany, kandidati, zobrazujiKandidatu, "1");

      return {
        ...model,
        searchTerm,
        // lastSearchTerm,
        kandidati,
        zobrazujiKandidatu,
        currPage: 0,
      };
    }
    case MSGS.VYBRANY_KRAJ: {
      // když se změní kraj
      const { vybranyKraj } = msg;
      // tak předělej model kandidátů
      const kandidati = model.kandidati.map((k) => {
        // pokud je kandidát z vybraného kraje nebo když jsou vybrané všechny kraje, tak mu změň filtr a search na zobrazit
        if (k.z === vybranyKraj || vybranyKraj === 0)
          return { ...k, f: 1, s: 1 };
        // jinak mu změň filtr na schovat a search na zobrazit
        else return { ...k, f: 0, s: 1 };
      });
      // a uprav počet zobrazených kandidátů
      const zobrazujiKandidatu = kandidati.reduce(sumVisible, 0);
      // a překresli grafy
      prekresliGrafZen(kandidati, zobrazujiKandidatu, "1");
      prekresliGrafVeku(kandidati, zobrazujiKandidatu, "1");
      prekresliGrafStran(model.strany, kandidati, zobrazujiKandidatu, "1");

      return {
        ...model,
        kandidati,
        vybranyKraj,
        zobrazujiKandidatu,
        currPage: 0,
        searchTerm: "",
      };
    }
    case MSGS.VYBRANA_STRANA: {
      // když se změní strana
      const { vybranaStrana } = msg;
      // tak předělej model kandidátů
      const kandidati = model.kandidati.map((k) => {
        // pokud je kandidát z vybrané strany nebo když jsou vybrané všechny strany, tak mu změň q filtr a search na zobrazit
        if (k.k === vybranaStrana || vybranaStrana === 0)
          return { ...k, q: 1, s: 1 };
        // jinak mu změň q filtr na schovat a search na zobrazit
        else return { ...k, q: 0, s: 1 };
      });
      const zobrazujiKandidatu = kandidati.reduce(sumVisible, 0);
      // a překresli grafy
      prekresliGrafZen(kandidati, zobrazujiKandidatu, "1");
      prekresliGrafVeku(kandidati, zobrazujiKandidatu, "1");
      prekresliGrafStran(model.strany, kandidati, zobrazujiKandidatu, "1");

      return {
        ...model,
        kandidati,
        vybranaStrana,
        zobrazujiKandidatu,
        currPage: 0,
        searchTerm: "",
      };
    }
    case MSGS.CURR_PAGE: {
      const { currPage } = msg;
      let newCurrPage = model.currPage;
      if (currPage === "←Předchozí") newCurrPage = model.currPage--;
      if (currPage === "Další→") newCurrPage = model.currPage++;
      return { ...model, newCurrPage };
    }
    case MSGS.ZRUSIT_VYBER: {
      localStorage.setItem("kandidatiSrdicka", JSON.stringify([]));
      document.getElementById(`graf-zeny-2`).classList.add("dn");
      document.getElementById(`graf-vek-2`).classList.add("dn");
      document.getElementById(`graf-strany-2`).classList.add("dn");
      return model;
    }
    case MSGS.SRDICKO: {
      const { id } = msg;
      // podívej se do LS a načti z ní uložené kandidáty
      const ulozeniKandidati = JSON.parse(localStorage.kandidatiSrdicka);
      // zjisti index osrdíčkovaného kandidáta
      const index = ulozeniKandidati.indexOf(id);
      // pokud vybraný kandidát v LS není, přidej ho
      if (index < 0) {
        const noviUlozeniKandidati = [...ulozeniKandidati, Number(id)];
        localStorage.kandidatiSrdicka = JSON.stringify(noviUlozeniKandidati);
        // překresli grafy
        const kandidatiDoGrafu = noviUlozeniKandidati.map(
          (id) => model.kandidati[id]
        );
        prekresliGrafZen(kandidatiDoGrafu, noviUlozeniKandidati.length, "2");
        prekresliGrafVeku(kandidatiDoGrafu, noviUlozeniKandidati.length, "2");
        prekresliGrafStran(
          model.strany,
          kandidatiDoGrafu,
          noviUlozeniKandidati.length,
          "2"
        );

        // pokud vybraný kandidát v LS je, odeber ho
      } else {
        ulozeniKandidati.splice(index, 1);
        localStorage.kandidatiSrdicka = JSON.stringify(ulozeniKandidati);
        //překresli grafy
        const kandidatiDoGrafu = ulozeniKandidati.map(
          (id) => model.kandidati[id]
        );
        prekresliGrafZen(kandidatiDoGrafu, ulozeniKandidati.length, "2");
        prekresliGrafVeku(kandidatiDoGrafu, ulozeniKandidati.length, "2");
        prekresliGrafStran(
          model.strany,
          kandidatiDoGrafu,
          ulozeniKandidati.length,
          "2"
        );
      }
    }
  }
  return model;
}

export default update;
