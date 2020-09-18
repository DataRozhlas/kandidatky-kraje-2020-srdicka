import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import { searchTermInput, vyberStranu, vyberKraj, zmenStranku } from "./Update";

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
} = hh(h);

//filtr kandidátů, kteří se mají zobrazit

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
    .filter((k) => k.s === 1 && k.f === 1)
    .slice(minKand, maxKand);
}

// tabulky
function cell(tag, className, value) {
  return tag({ className }, value);
}

const tableHeader = thead([
  tr([
    cell(th, "pa1", "Pořadí"),
    cell(th, "pa1", "Jméno"),
    cell(th, "pa1", "Věk"),
    cell(th, "pa1", "Povolání"),
    cell(th, "pa1", "Strana"),
    cell(th, "pa1", "Bydliště"),
    cell(th, "pa1", ""),
  ]),
]);

function kandidatRow(dispatch, className) {
  return function (kandidat) {
    return tr({ className }, [
      cell(td, "pa1", kandidat.c),
      cell(td, "pa1", `${kandidat.j} ${kandidat.p}`),
      cell(td, "pa1", kandidat.v),
      cell(td, "pa1", kandidat.po),
      cell(td, "pa1", kandidat.k),
      cell(td, "pa1", kandidat.b),
      // cell(td, 'pa2', <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>),
    ]);
  };
}

function kandidatiBody(dispatch, className, kandidati) {
  const rows = kandidati.map(kandidatRow(dispatch, "stripe-dark"));
  return tbody({ className }, rows);
}

function tableView(dispatch, kandidati) {
  if (kandidati.length === 0) {
    return div(
      { className: "mv2 i black-50" },
      "Vašemu zadání neodpovídá žádný kandidát."
    );
  }
  return table({ className: "mv2 w-100 collapse f7", id: "tab1" }, [
    tableHeader,
    kandidatiBody(dispatch, "", kandidati),
  ]);
}

// menu

function generateOption(moznost) {  
  if (Object.keys(moznost).length == 2) 
    return option({ className: "", value: moznost.KRZAST }, moznost.NAZEVKRZ)
  else return option({ className: "", value: moznost.k }, moznost.n);
}

function selectBox(model, allText, onchange) {
  switch (allText) {
    case "Všechny kraje": {
      return select({ className: "w-3 pa1", onchange }, [
        option({ className: "", value: 0 }, allText),
        model.kraje
          .filter((k) => {
            if (model.vybranaStrana === 0) return true;
            // u každého kraje ověřit, jestli v něm vybranaStrana kandiduje
            const zkoumanaStrana = model.strany.filter(s => s.k === model.vybranaStrana);
            const kodUcasti = zkoumanaStrana[0].r.charAt(k.KRZAST-1);
            if ( kodUcasti === "0") return true;
            else return false;
          })
          .map((moznost) => generateOption(moznost)),
      ]);
    }
    case "Všechny strany": {
      return select({ className: "w-3 pa1", onchange }, [
        option({ className: "", value: 0 }, allText),
        model.strany
          .filter((s) => {
            if (model.vybranyKraj === 0) return true;
            const kodUcasti = s.r.charAt(model.vybranyKraj - 1);
            if (kodUcasti === "0") return true;
            else return false;
          })
          .map((moznost) => generateOption(moznost)),
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

function view(dispatch, model) {
  return div({ className: "mw-100 center" }, [
    isMobile(model),
    h2({ className: "sans-serif f3 pv1 bb" }, "Skutečné kandidátky"),
    formView(dispatch, model),
    tableView(dispatch, naporcujKandidaty(model)),
    makePagination(dispatch, model),
    h2({ className: "sans-serif f3 pv1 bb" }, "Vámi vybraná kandidátka"),
    pre(JSON.stringify(model.vybranyKraj, null, 2)),
    pre(JSON.stringify(model.vybranaStrana, null, 2)),
    pre(JSON.stringify(model.searchTerm, null, 2)),
  ]);
}

function srdicko() {
  // <button>
  // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
  //   <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
  // </svg>
  // </button>
}

function selectedTableView() {}

function drawCharts() {}

function drawChartGender() {}

function drawChartAge() {}

function drawChartParties() {}

export default view;
