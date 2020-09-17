const MSGS = {
  SEARCH_TERM: "SEARCH_TERM",
  VYBRANY_KRAJ: "VYBRANY_KRAJ",
  VYBRANA_STRANA: "VYBRANA_STRANA",
  CURR_PAGE: "CURR_PAGE",
  IS_MOBILE: "IS_MOBILE",
};

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
  return acc + kandidat.s;
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
        kandidati,
        zobrazujiKandidatu,
        currPage: 0,
      };
    }
    case MSGS.VYBRANY_KRAJ: {
      const { vybranyKraj } = msg;
      return { ...model, vybranyKraj };
    }
    case MSGS.VYBRANA_STRANA: {
      const { vybranaStrana } = msg;
      return { ...model, vybranaStrana };
    }
    case MSGS.CURR_PAGE: {
      const { currPage } = msg;
      let newCurrPage = model.currPage;
      if (currPage === "← Předchozí") newCurrPage = model.currPage--;
      if (currPage === "Další →") newCurrPage = model.currPage++;
      return { ...model, newCurrPage };
    }
  }
  return model;
}

function selectStrana() {}

function selectKraj() {}

function dejSrdicko() {}

function odeberSrdicko() {}

export default update;
