import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
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
  p,
  i,
} = hh(h);

//paginace

function makeNavButton(text, dispatch) {
  return a(
    {
      className: `dib dim link black f4 b pa1 pointer sans-serif`,
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
      ? makeNavButton("← Předchozí", dispatch)
      : span(
          { className: `dib f4 b pa1 sans-serif`, style: "visibility:hidden" },
          "← Předchozí"
        ),
    model.isMobile
      ? div(
          { className: "dib pa1 sans-serif f7-m f6" },
          `${model.zobrazujiKandidatu} kandidátů`
        )
      : div(
          { className: "dib pa1 sans-serif f7-m f6" },
          `${model.zobrazujiKandidatu} kandidátů | stránka ${
            model.currPage + 1
          } z ${Math.ceil(
            model.zobrazujiKandidatu / (model.isMobile ? 10 : 20)
          )}`
        ),
    model.currPage <
    Math.floor(model.zobrazujiKandidatu / (model.isMobile ? 10 : 20))
      ? makeNavButton("Další →", dispatch)
      : span(
          { className: `dib f4 b pa1 sans-serif`, style: "visibility:hidden" },
          "Další →"
        ),
  ]);
}

function naporcujKandidaty(model) {
  const minKand = model.isMobile ? model.currPage * 10 : model.currPage * 20;
  const maxKand = model.isMobile ? minKand + 10 : minKand + 20;
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
  const vysledek =
    localStorage.getItem("kandidatiSrdicka") &&
    JSON.parse(localStorage.kandidatiSrdicka).includes(id)
      ? true
      : false;
  return vysledek;
}

// tabulky
 function pripravVybrane(model) {
  const vybrani = JSON.parse(localStorage.kandidatiSrdicka);
  const zobrazit = model.kandidati.filter((k, i) => vybrani.includes(i));
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

const tableHeader = thead([
  tr([
    cell(th, "pa1", ""),
    cell(th, "pa1", "Jméno"),
    cell(th, "pa1", "Věk"),
    cell(th, "pa1", "Povolání"),
    cell(th, "pa1", "Bydliště"),
    cell(th, "pa1", "Kraj"),
    cell(th, "pa1", "Strana"),
    cell(th, "pa1", "Pořadí"),
  ]),
]);

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
      cell(td, "pa1", zjistiKraj(model, kandidat.z)),
      cell(td, "pa1", zjistiStranu(model, kandidat.k)),
      cell(td, "pa1", kandidat.c),
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
  return table({ className: "mv2 w-100 collapse f6-ns f7", id: "tab1" }, [
    tableHeader,
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
      return select({ className: "w-3 pa1", id: "krajSelectBox", onchange }, [
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
      return select({ className: "w-3 pa1", id: "stranaSelectBox", onchange }, [
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
        "mw-100 center flex flex-wrap justify-between sans-serif f5-m f5-l f7",
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
          className: "w-3 pa1",
        },
        [
          label({}, "Hledej "),
          input({
            className: "input-reset ba",
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
    case 1: return `${cislo} kandidát`
    case 2: return `${cislo} kandidáti`
    case 3: return `${cislo} kandidáti`
    case 4: return `${cislo} kandidáti`
    default: return `${cislo} kandidátů`
  }
}

function view(dispatch, model) {
  return div({ className: "mw-100 center" }, [
    isMobile(model),
    h2({ className: "sans-serif f3 pv1 bb" }, "Skutečné kandidátky"),
    formView(dispatch, model),
    tableView(dispatch, model, naporcujKandidaty(model), false),
    makePagination(dispatch, model),
    h2({ className: "sans-serif f3 pv1 bb" }, "Vámi vybraná kandidátka"),
    tableView(dispatch, model, pripravVybrane(model), true),
    div({ className: "dib pa2 w-100 sans-serif f7-m f6 tc" }, sklonujKandidata(JSON.parse(localStorage.kandidatiSrdicka).length)),
    pre(JSON.stringify(localStorage.getItem("kandidatiSrdicka"), null, 2)),
  ]);
}


function drawCharts() {}

function drawChartGender() {}

function drawChartAge() {}

function drawChartParties() {}

export default view;
