$(document).ready(function(){
        $.getJSON('http://stats.oecd.org/SDMX-JSON/data/REFSERIES/AUS+CAN../OECD?startTime=2005&dimensionAtObservation=AllDimensions', resultHandler);
        $('h1').fadeIn(1000).delay(1000).fadeOut(1000);
});

function cardClick() {
    if (!$(this).hasClass('flip')) {
        $(this).addClass('flip');
        var active = $('.activated');
        if (active.length === 0) {
            $(this).addClass('activated');
        } else if (active.data('id') === $(this).data('id')) {
            active.removeClass('activated');
            $(this).addClass('finished');
            active.addClass('finished');
	        if ($('.click').not('.finished').length === 0) {
                alert('Congratulations, you won!');
            }
        } else {
            $(this).addClass('activated');
            setTimeout(function() {$('.activated').removeClass('activated').removeClass('flip');}, 1000);
        }
    }
}

function getCards(data, numCards) {
    var cards = [], cardId = 0;
    for (var dataSetIndex = 0; dataSetIndex < data.dataSets.length; dataSetIndex++) {
        for (var measureName in data.dataSets[dataSetIndex].observations) {
            if (cards.length >= numCards) {
                return cards;
            }
            var measureDimensionValues = measureName.split(":"),
            card = [
		        cardId++,
                {
                    name:"Value",
                    value:parseFloat(data.dataSets[dataSetIndex].observations[measureName])
                }
            ];
            for (var i = 0; i < measureDimensionValues.length; i++) {
                card.push({
                    name:data.structure.dimensions.observation[i].name,
                    value:data.structure.dimensions.observation[i].values[parseInt(measureDimensionValues[i])].name});
            }
            cards.push(card);
        }
    }
    return cards;
}

function renderCard(card) {
    var cardElem = document.createElement('div');
    cardElem.className = 'click panel noflip';
    $('#cards').append(cardElem);
    var front = document.createElement('div');
    front.className = 'front';
    cardElem.appendChild(front);
    var frontStr = document.createTextNode('StatMem');
    front.appendChild(frontStr);
    var back = document.createElement('div');
    back.className = 'back';
    cardElem.appendChild(back);
    $(cardElem).data('id', card[0]);
    for (var i = 1; i < card.length; i++) {
        var p = document.createElement('p');
        back.appendChild(p);
        var name = document.createElement('strong');
        p.appendChild(name);
        var nameStr = document.createTextNode(card[i].name + ': ');
        name.appendChild(nameStr);
        var valueStr = document.createTextNode(card[i].value);
        p.appendChild(valueStr);
    }
}

function shuffle(cards) {
    var i = cards.length,
    j,
    temp;
    while (--i) {
        j = Math.floor(Math.random() * (i - 1));
	temp = cards[i];
	cards[i] = cards[j];
	cards[j] = temp;
    }
}

function resultHandler(data) {
    var cards = getCards(data, 8);
    cards = cards.concat(cards);
    shuffle(cards);
    for (var i = 0; i < cards.length; i++) {
        renderCard(cards[i]);
    }
    $('.click').click(cardClick);
    $('#cards').fadeIn(500);
    $('.footer').fadeIn(500);
}