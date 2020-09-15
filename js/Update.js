const MSGS = {
    SEARCH_TERM: 'SEARCH_TERM',
    VYBRANY_KRAJ: 'VYBRANY_KRAJ',
    VYBRANA_STRANA: 'VYBRANA_STRANA',
};

export function searchTermInput(searchTerm) {
    return {
        type: MSGS.SEARCH_TERM,
        searchTerm,
    }
}

export function vyberKraj(vybranyKraj) {
    return {
        type: MSGS.VYBRANY_KRAJ,
        vybranyKraj,
    }
}

export function vyberStranu(vybranaStrana) {
    return {
        type: MSGS.VYBRANA_STRANA,
        vybranaStrana,
    }
}

function update (msg, model) {
    switch (msg.type) {
        case MSGS.SEARCH_TERM: {
            const { searchTerm } = msg;
            return { ...model, searchTerm };
        }
        case MSGS.VYBRANY_KRAJ : {
            const { vybranyKraj } = msg;
            return { ...model, vybranyKraj}
        }
        case MSGS.VYBRANA_STRANA : {
            const { vybranaStrana } = msg;
            return { ...model, vybranaStrana}
        }
    }
    return model;
}


function selectStrana () {

}

function selectKraj () {

}


function dejSrdicko () {

}

function odeberSrdicko () {

}

export default update;