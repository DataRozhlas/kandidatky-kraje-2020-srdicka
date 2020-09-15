import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

const { pre, div, h2, select, option, form, label, input } = hh(h);


function generateOption(moznost) {
    if (Object.keys(moznost).length==2)
      return option( {className: '', value: moznost.KRZAST}, moznost.NAZEVKRZ)
    else return option( {className: '', value: moznost.nk}, moznost.n)
}

function selectBox (moznosti, allText) {
  return select( {className: 'w-3 pa1'}, [
    option( {className: '', value: 'all'}, allText),
    moznosti.map(moznost => generateOption(moznost)),
  ])
}

function formView (dispatch, model) {
  const { searchTerm } = model;
  return div( {className: 'mw-100 center flex flex-wrap justify-between sans-serif'}, [
    selectBox(model.kraje, "Všechny kraje"),
    selectBox(model.strany, "Všechny strany"),
    form(
      {
        className: 'w-3 pa1'
      },[
        label( {}, 'Hledej '),
        input({
          className: 'input-reset ba',
          type: 'text',
          value: searchTerm,
      })
      ])
  ]);
}

function view (dispatch, model) {
  return div({ className: 'mw-100 center'}, [
    h2({ className: 'sans-serif f3 pv1 bb' }, 'Skutečné kandidátky'),
    formView(dispatch, model),
    pre(JSON.stringify(model, null, 2)),
  ]);  
}





function searchBox () {

}

function tableView () {

}

function tableHeader () {

}

function kandidatiBody () {

}

function kandidatRow () {

}

function cell () {

}


function srdicko () {
//   <button>
// <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
// </svg>
// </button>

// <button>
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//   <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
// </svg>
// </button>
}

function selectedTableView () {

}

function drawCharts () {

}

function drawChartGender () {

}

function drawChartAge () {

}

function drawChartParties () {

}

export default view;