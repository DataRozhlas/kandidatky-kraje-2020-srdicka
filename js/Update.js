const MSGS = {
  SEARCH_TERM: "SEARCH_TERM",
  VYBRANY_KRAJ: "VYBRANY_KRAJ",
  VYBRANA_STRANA: "VYBRANA_STRANA",
  CURR_PAGE: "CURR_PAGE",
  DEJ_SRDICKO: "DEJ_SRDICKO",
};

export function dejSrdicko(id) {
    return {
        type: MSGS.DEJ_SRDICKO,
        id,
    }
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
        if (k.z === vybranyKraj || vybranyKraj === 0) return { ...k, f: 1, s: 1 };
    // jinak mu změň filtr na schovat a search na zobrazit
        else return { ...k, f: 0, s: 1 };
      });
    // a uprav počet zobrazených kandidátů  
      const zobrazujiKandidatu = kandidati.reduce(sumVisible, 0);
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
        if (k.k === vybranaStrana || vybranaStrana === 0) return { ...k, q: 1, s: 1 };
    // jinak mu změň q filtr na schovat a search na zobrazit
        else return { ...k, q: 0, s: 1 };
      });
      const zobrazujiKandidatu = kandidati.reduce(sumVisible, 0);
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
    case MSGS.DEJ_SRDICKO: {
      const {id} = msg;
      let ulozeniKandidati = [];    
      localStorage.getItem("kandidatiSrdicka") ? ulozeniKandidati = JSON.parse(localStorage.kandidatiSrdicka) : null;      
      const updatovaniKandidati = [...ulozeniKandidati, Number(id)];
      localStorage.kandidatiSrdicka = JSON.stringify(updatovaniKandidati);
    }
  }
  return model;
}

export default update;
