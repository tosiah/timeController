// BUDGET CONTROLLER
var eventController = (function () {

    var Event = function (id, name, date) {
        this.id = id;
        this.name = name;
        this.date = date;
    };

    /*
    var Event = function(id, name, date) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.time = "00:00";
    };*/


    var data = {
        events: []
    };


    return {
        addEvent: function (name, date) {
            var newEvent, ID;

            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID
            if (data.events.length > 0) {
                ID = data.events[data.events.length - 1].id + 1;
            } else {
                ID = 0;
            }

            newEvent = new Event(ID, name, date);

            // Push it into our data structure
            data.events.push(newEvent);

            // Return the new element
            return newEvent;
        },

        getDate: function(eventId){
            var date = -1;
            data.events.forEach(function(current){
                if(current.id==eventId){
                    date = current.date;
                }
            })
            return date;
        },


        testing: function () {
            console.log(data);
        }
    };

})();




// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputName: '.add__name',
        inputDate: '.add__date',
        inputTime: '.add__time',
        inputBtn: '.add__btn',
        container: '.container'
    };






    return {
        getInput: function () {
            return {
                name: document.querySelector(DOMstrings.inputName).value,
                date: document.querySelector(DOMstrings.inputDate).value,
                time: document.querySelector(DOMstrings.inputTime).value
            };
        },

        addEvent: function (newEvent) {
            var eventElement = '<div class="item clearfix" id="event-%Id%"><div class="item__name">%Name%</div><div class="right clearfix"><div class="item__date">%Date%</div><div class="item__time">%Time%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div><div class="item__count"><button class="item__count--btn"><i class="ion-ios-close-outline"></i></button></div>';

            var newDiv = document.createElement('div');

            var year = newEvent.date.getFullYear();
            var month = newEvent.date.getMonth() + 1;
            var day = newEvent.date.getDate();
            var hours = newEvent.date.getHours();
            var minutes = newEvent.date.getMinutes();



            eventElement = eventElement
            .replace('%Id%', parseInt(newEvent.id))
            .replace('%Name%', newEvent.name)
            .replace('%Date%', year + '-' + month + '-' + day)
            .replace('%Time%', hours + ":" + minutes);

            newDiv.innerHTML = eventElement;
            document.querySelector(DOMstrings.container).appendChild(newDiv);
        },

        clearFields: function () {
            document.querySelector(DOMstrings.inputName).value = "";
            document.querySelector(DOMstrings.inputDate).value = 0;
            document.querySelector(DOMstrings.inputTime).value = 0
        },

        displayTimeLeft: function() {

        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();




// GLOBAL APP CONTROLLER
var controller = (function (eventCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddEvent);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddEvent();
            }
        });

       // document.querySelector(DOM.container).addEventListener('click', ctrlDeleteEvent);
        document.querySelector(DOM.container).addEventListener('click', startCounting);
    };


    var ctrlAddEvent = function () {
        var input, newEvent;

        // 1. Get the field input data
        input = UICtrl.getInput();
        console.log(input);
        var inputName = input.name;
        var inputDate = new Date(input.date);
        var inputTime = input.time;
        var time = inputTime.split(":");

        if (input.name !== "" && !isNaN(inputDate)) {
            if(inputTime===""){
                inputDate.setHours(0,0);
            }  else{
                inputDate.setHours(time[0], time[1]);

            }
            // 2. Add the item to the budget controller
            newEvent = eventCtrl.addEvent(inputName, inputDate);
            console.log(newEvent);
            // 3. Add the item to the UI
            UICtrl.addEvent(newEvent);

            // 4. Clear the fields
            UICtrl.clearFields();
        }
    };

    var startCounting = function (event) {
        var eventID;

        eventID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        eventID = eventID.substring(6);
        console.log(eventID);

        if (eventID) {

            // 1. retreve event's date from the data structure
            console.log(eventCtrl.getDate(eventID));

            // 2. Display time left from the UI
            UICtrl.displayTimeLeft(eventID);

        }
    }


    var ctrlDeleteEvent = function (event) {
        var eventID;

        eventID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (eventID) {

            // 1. delete the item from the data structure
            eventCtrl.deleteItem(eventID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(eventID);

        }
    };

    return {
        init: function () {
            console.log('Application has started.');

            setupEventListeners();
        }
    };

})(eventController, UIController);


controller.init();