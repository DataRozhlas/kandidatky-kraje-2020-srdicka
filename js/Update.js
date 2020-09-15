const MSGS = {
    SEARCH_TERM: 'SEARCH_TERM',
};

export function searchTermInput(searchTerm) {
    return {
        type: MSGS.SEARCH_TERM,
        searchTerm,
    }
}

function update (msg, model) {
    switch (msg.type) {
        case MSGS.SEARCH_TERM: {
            const { searchTerm } = msg;
            return { ...model, searchTerm };
        }
    }
    return model;
}


function selectStrana () {

}

function selectKraj () {

}

function hledat () {

}

function dejSrdicko () {

}

function odeberSrdicko () {

}

export default update;