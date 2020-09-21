import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import Highcharts from "highcharts";
import grafZeny from "./charts/grafZeny";
import grafVek from "./charts/grafVek";
import grafStrany from "./charts/grafStrany";
import {
  searchTermInput,
  vyberStranu,
  vyberKraj,
  zmenStranku,
  srdicko,
} from "./Update";

const {
  pre,
  div,
  h2,
  select,
  option,
  form,
  label,
  input,
  table,
  thead,
  tbody,
  tr,
  th,
  td,
  nav,
  a,
  span,
  i,
} = hh(h);

//paginace

function makeNavButton(text, dispatch) {
  return a(
    {
      className: `dib dim link black f5 f4-ns b pa1 pointer sans-serif`,
      href: `#`,
      onclick: (e) => {
        e.preventDefault();
        dispatch(zmenStranku(e.target.text));
      },
    },
    text
  );
}

function makePagination(dispatch, model) {
  return nav({ className: "mw100 pv1 flex flex-nowrap justify-between" }, [
    model.currPage > 0
      ? makeNavButton("←Předchozí", dispatch)
      : span(
          { className: `dib f4 b pa1 sans-serif`, style: "visibility:hidden" },
          "←Předchozí"
        ),
    model.isMobile
      ? div(
          { className: "dib pa1 sans-serif f7-m f6" },
          `${sklonujKandidata(model.zobrazujiKandidatu)}`
        )
      : div(
          { className: "dib pa1 sans-serif f7-m f6" },
          `${sklonujKandidata(model.zobrazujiKandidatu)} | stránka ${
            model.currPage + 1
          } z ${Math.ceil(
            model.zobrazujiKandidatu / (model.isMobile ? 5 : 10)
          )}`
        ),
    model.currPage <
    Math.floor(model.zobrazujiKandidatu / (model.isMobile ? 5 : 10))
      ? makeNavButton("Další→", dispatch)
      : span(
          { className: `dib f4 b pa1 sans-serif`, style: "visibility:hidden" },
          "Další→"
        ),
  ]);
}

function naporcujKandidaty(model) {
  const minKand = model.isMobile ? model.currPage * 5 : model.currPage * 10;
  const maxKand = model.isMobile ? minKand + 5 : minKand + 10;
  return model.kandidati
    .filter((k) => k.s === 1 && k.f === 1 && k.q === 1)
    .slice(minKand, maxKand);
}
// srdíčka

function kresliSrdicko(dispatch, model, kandidat, jeVybrany) {
  if (!jeVybrany) {
    return i({
      className: "ph1 far fa-heart pointer hover-red",
      title: "klikni a dáš srdíčko",
      onclick: () => {
        dispatch(srdicko(model.kandidati.indexOf(kandidat)));
      },
    });
  } else {
    return i({
      className: "ph1 fas fa-heart pointer red hover-washed-red",
      title: "klikni a sebereš srdíčko",
      onclick: () => {
        dispatch(srdicko(model.kandidati.indexOf(kandidat)));
      },
    });
  }
}

function jeVybrany(model, kandidat) {
  const id = model.kandidati.indexOf(kandidat);
  const vysledek = JSON.parse(localStorage.kandidatiSrdicka).includes(id)
    ? true
    : false;
  return vysledek;
}

// tabulky
function pripravVybrane(model) {
  const vybrani = JSON.parse(localStorage.kandidatiSrdicka);
  const zobrazit = vybrani.map((id) => model.kandidati[id]);
  //  const zobrazit = model.kandidati.filter((k, i) => vybrani.includes(i));
  return zobrazit;
}

function zjistiStranu(model, id) {
  const strana = model.strany.filter((s) => s.k === id);
  return strana[0].nk;
}

function zjistiKraj(model, id) {
  const kraj = model.kraje.filter((k) => k.KRZAST === id);
  return kraj[0].NAZEVKRZ;
}

function cell(tag, className, value) {
  return tag({ className }, value);
}

function tableHeader(model) {
  const tableHeader = thead([
    tr([
      cell(th, "pa1", ""),
      cell(th, "pa1", "Jméno"),
      cell(th, "pa1", "Věk"),
      cell(th, "pa1", "Povolání"),
      cell(th, "pa1", "Bydliště"),
      model.isMobile ? null: cell(th, "pa1", "Kraj"),
      cell(th, "pa1", "Strana"),
      model.isMobile ? null : cell(th, "pa1", "Pořadí"),
    ]),
  ]);
  return tableHeader;
}

function kandidatRow(dispatch, className, model) {
  return function (kandidat) {
    return tr({ className }, [
      cell(
        td,
        "pa1",
        kresliSrdicko(dispatch, model, kandidat, jeVybrany(model, kandidat))
      ),
      cell(td, "pa1", `${kandidat.j} ${kandidat.p}`),
      cell(td, "pa1", kandidat.v),
      cell(td, "pa1", kandidat.po),
      cell(td, "pa1", kandidat.b),
      model.isMobile ? null : cell(td, "pa1", zjistiKraj(model, kandidat.z)),
      cell(td, "pa1", zjistiStranu(model, kandidat.k)),
      model.isMobile ? null : cell(td, "pa1 tc", kandidat.c),
    ]);
  };
}

function kandidatiBody(dispatch, className, kandidati, model) {
  const rows = kandidati.map(kandidatRow(dispatch, "stripe-dark", model));
  return tbody({ className }, rows);
}

function tableView(dispatch, model, kandidati, vybrani) {
  if (kandidati.length === 0 && !vybrani) {
    return div(
      { className: "mv2 sans-serif" },
      "Vašemu hledání neodpovídá žádný kandidát. Zkuste něco jiného!"
    );
  }
  if (kandidati.length === 0 && vybrani) {
    return div(
      { className: "mv2 sans-serif" },
      "Zatím jste nikoho nevybrali. Zkuste někomu dát srdíčko!"
    );
  }
  return table({ className: "mv2 w-100-ns collapse f6-ns f7", style: `${model.isMobile ? "margin-left: -15px; width:100vw" : null}`, id: "tab1" }, [
    tableHeader(model),
    kandidatiBody(dispatch, "", kandidati, model),
  ]);
}

// menu

function generateOption(moznost, model) {
  if (Object.keys(moznost).length == 2)
    return option(
      {
        className: "",
        value: moznost.KRZAST,
        selected: model.vybranyKraj === moznost.KRZAST,
      },
      moznost.NAZEVKRZ
    );
  else
    return option(
      {
        className: "",
        value: moznost.k,
        selected: model.vybranaStrana === moznost.k,
      },
      moznost.n
    );
}

function selectBox(model, allText, onchange) {
  switch (allText) {
    case "Všechny kraje": {
      return select({ className: "w-100 w-30-ns pa1", id: "krajSelectBox", onchange }, [
        option({ className: "", value: 0 }, allText),
        model.kraje
          .filter((k) => {
            if (model.vybranaStrana === 0) return true;
            // u každého kraje ověřit, jestli v něm vybranaStrana kandiduje
            const zkoumanaStrana = model.strany.filter(
              (s) => s.k === model.vybranaStrana
            );
            const kodUcasti = zkoumanaStrana[0].r.charAt(k.KRZAST - 1);
            if (kodUcasti === "0") return true;
            else return false;
          })
          .map((moznost) => generateOption(moznost, model)),
      ]);
    }
    case "Všechny strany": {
      return select({ className: "w-100 w-30-ns pa1", id: "stranaSelectBox", onchange }, [
        option({ className: "", value: 0 }, allText),
        model.strany
          .filter((s) => {
            if (model.vybranyKraj === 0) return true;
            const kodUcasti = s.r.charAt(model.vybranyKraj - 1);
            if (kodUcasti === "0") return true;
            else return false;
          })
          .map((moznost) => generateOption(moznost, model)),
      ]);
    }
  }
}

function formView(dispatch, model) {
  const { searchTerm } = model;
  return div(
    {
      className:
        "mw-100 center flex flex-wrap justify-between sans-serif f5 f5-ns",
    },
    [
      selectBox(model, "Všechny kraje", (e) =>
        dispatch(vyberKraj(Number(e.target.value)))
      ),
      selectBox(model, "Všechny strany", (e) =>
        dispatch(vyberStranu(Number(e.target.value)))
      ),
      form(
        {
          className: "w-100 w-30-ns pa1",
        },
        [
          label({ className: "w20" }, "Hledej "),
          input({
            className: "input-reset ba w-80",
            type: "text",
            placeholder: "jméno, povolání, bydliště",
            oninput: (e) => {
              dispatch(searchTermInput(e.target.value));
            },
            value: searchTerm,
          }),
        ]
      ),
    ]
  );
}

function isMobile(model) {
  window.innerWidth < 600 ? (model.isMobile = true) : (model.isMobile = false);
}

function sklonujKandidata(cislo) {
  switch (cislo) {
    case 1:
      return `${cislo} kandidát`;
    case 2:
      return `${cislo} kandidáti`;
    case 3:
      return `${cislo} kandidáti`;
    case 4:
      return `${cislo} kandidáti`;
    default:
      return `${cislo} kandidátů`;
  }
}

//grafy

function grafyVybranychInit(model, ls) {
  if (JSON.parse(ls).length === 0) {
    document.getElementById("graf-zeny-2").classList.add("dn");
    document.getElementById("graf-vek-2").classList.add("dn");
    document.getElementById("graf-strany-2").classList.add("dn");
  } else {
    const vybraniKandidati = JSON.parse(ls).map((id) => model.kandidati[id]);
    const pocetZen = vybraniKandidati.reduce((acc, kandidat) => {
      return acc + (kandidat.p.slice(-1) === "á" ? 1 : 0);
    }, 0);
    grafZeny.series[0].data[1].y = (pocetZen / JSON.parse(ls).length) * 100;
    grafZeny.series[0].data[0].y =
      100 - (pocetZen / JSON.parse(ls).length) * 100;
    Highcharts.chart("graf-zeny-2", grafZeny);

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
      celkVek / vybraniKandidati.length
    )} let`;
    Highcharts.chart("graf-vek-2", grafVek);

    const stranyPocty = model.strany.map((s) => {
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
    Highcharts.chart("graf-strany-2", grafStrany);
  }
}

function vlozGrafZen(model, jenVybrani) {
  const id = `graf-zeny-${jenVybrani ? "2" : "1"}`;
  return div({ className: "w-30 h5 ma0", id: id });
}

function vlozGrafVeku(model, jenVybrani) {
  return div(
    { className: "w-30 h5 ma0", id: `graf-vek-${jenVybrani ? "2" : "1"}` });
}

function vlozGrafStran(model, jenVybrani) {
  return div(
    {
      className: "w-30 h5 ma0",
      id: `graf-strany-${jenVybrani ? "2" : "1"}`,
    });
}

function vlozGrafy(model, jenVybrani) {
  return div({ className: "w-100 pa1 pt4 flex flex-wrap justify-between" }, [
    vlozGrafZen(model, jenVybrani),
    vlozGrafVeku(model, jenVybrani),
    vlozGrafStran(model, jenVybrani),
  ]);
}

function view(dispatch, model) {
  return div({ className: "mw-100 center pb5" }, [
    localStorage.getItem("kandidatiSrdicka")
      ? null
      : localStorage.setItem("kandidatiSrdicka", JSON.stringify([])),
    isMobile(model),
    h2({ className: "f3 pv1 bb" }, "Skutečné kandidátky"),
    formView(dispatch, model),
    tableView(dispatch, model, naporcujKandidaty(model), false),
    makePagination(dispatch, model),
    vlozGrafy(model, false),
    h2({ className: "f3 pv1 bb" }, "Vámi vybraná kandidátka"),
    tableView(dispatch, model, pripravVybrane(model), true),
    div(
      { className: "dib pa2 w-100 sans-serif f7-m f6 tc" },
      sklonujKandidata(JSON.parse(localStorage.kandidatiSrdicka).length)
    ),
    vlozGrafy(model, true),
    document.addEventListener("DOMContentLoaded", function (event) {
      Highcharts.setOptions({
        lang: {
          numericSymbols: [" tis.", " mil.", " mld.", "T", "P", "E"],
        },
      });
      Highcharts.chart("graf-zeny-1", grafZeny);
      Highcharts.chart("graf-vek-1", grafVek);
      Highcharts.chart("graf-strany-1", grafStrany);
      grafyVybranychInit(model, localStorage.getItem("kandidatiSrdicka"));
    }),
    //pre(JSON.stringify(localStorage.getItem("kandidatiSrdicka"), null, 2)),
  ]);
}

export default view;
