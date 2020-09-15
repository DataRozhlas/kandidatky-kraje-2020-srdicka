import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

const { pre, div, h2, select, option } = hh(h);


function formView (dispatch, model) {
  return div( {className: 'mw-100 center'}, [
    select( {className: '', name: 'vyberStrany'}, [
      option({className: '', value: 'ODS'}, 'ODS'),
      option({className: '', value: 'Komouš'}, 'komouš')
    ])
  ]);
}

function view (dispatch, model) {
  return div({ className: 'mw-100 center'}, [
    h2({ className: 'sans-serif f3 pv1' }, 'Skutečné kandidátky:'),
    formView(dispatch, model),
    pre(JSON.stringify(model, null, 2)),
  ]);  
}



function selectBox () {

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