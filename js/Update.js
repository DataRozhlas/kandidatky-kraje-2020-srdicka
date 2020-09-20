import Highcharts from "highcharts";
import grafZeny from "./charts/grafZeny";

const MSGS = {
  SEARCH_TERM: "SEARCH_TERM",
  VYBRANY_KRAJ: "VYBRANY_KRAJ",
  VYBRANA_STRANA: "VYBRANA_STRANA",
  CURR_PAGE: "CURR_PAGE",
  SRDICKO: "SRDICKO",
};

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
    const vybraniKandidati = kandidati.filter(
      (k) => k.s === 1 && k.f === 1 && k.q === 1
    );
    const pocetZen = vybraniKandidati.reduce((acc, kandidat) => {
      return acc + (kandidat.p.slice(-1) === "á" ? 1 : 0);
    }, 0);
    grafZeny.series[0].data[1].y = (pocetZen / zobrazujiKandidatu) * 100;
    grafZeny.series[0].data[0].y = 100 - (pocetZen / zobrazujiKandidatu) * 100;
    Highcharts.chart(`graf-zeny-${cisloGrafu}`, grafZeny);
  } else {
    document.getElementById(`graf-zeny-${cisloGrafu}`).classList.add("dn");
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
      if (currPage === "← Předchozí") newCurrPage = model.currPage--;
      if (currPage === "Další →") newCurrPage = model.currPage++;
      return { ...model, newCurrPage };
    }
    case MSGS.SRDICKO: {
      const { id } = msg;
      // podívej se do LS a načti z ní uložené kandidáty
      const ulozeniKandidati = JSON.parse(localStorage.kandidatiSrdicka);
      // zjisti index vybraného kandidáta  
      const index = ulozeniKandidati.indexOf(id);
      // pokud vybraný kandidát v LS není, přidej ho
      if (index < 0) {
        const noviUlozeniKandidati = [...ulozeniKandidati, Number(id),];
        localStorage.kandidatiSrdicka = JSON.stringify(noviUlozeniKandidati);
        // překresli grafy
        prekresliGrafZen(noviUlozeniKandidati.map((id) => model.kandidati[id]), noviUlozeniKandidati.length, "2");
      // pokud vybraný kandidát v LS je, odeber ho  
      } else {
        ulozeniKandidati.splice(index, 1);
        localStorage.kandidatiSrdicka = JSON.stringify(ulozeniKandidati);
        //překresli grafy
        prekresliGrafZen(ulozeniKandidati.map((id) => model.kandidati[id]), ulozeniKandidati.length, "2");
      }
    }
  }
  return model;
}

export default update;
