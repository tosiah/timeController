// BUDGET CONTROLLER
var eventController = (function() {
    
    var Event = function(id, name, date, time) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.time = time;
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
        addEvent: function(name, date, time) {
            var newEvent, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            if (data.events > 0) {
                ID = data.events[data.events.length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            newEvent = new Event(ID, name, date, time);
            
            // Push it into our data structure
            data.events.push(newEvent);
            
            // Return the new element
            return newEvent;
        },

        
        testing: function() {
            console.log(data);
        }
    };
    
})();




// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputName: '.add__name',
        inputDate: '.add__date',
        inputTime: '.add__time',
        inputBtn: '.add__btn',
        container: '.container'
    };
    
    var addEvent = function(newEvent){
        document.querySelector(DOMstrings.inputName).innerHTML=newEvent.name;
        document.querySelector(DOMstrings.inputDate).value=newEvent.date;
        document.querySelector(DOMstrings.inputTime).value=newEvent.time
    };

    var clearFields = function(){
        document.querySelector(DOMstrings.inputName).innerHTML="";
        document.querySelector(DOMstrings.inputDate).value=0;
        document.querySelector(DOMstrings.inputTime).value=0
    };
    
    
    return {
        getInput: function() {
            return {
                name: document.querySelector(DOMstrings.inputName).value,
                date: document.querySelector(DOMstrings.inputDate).value,
                time: document.querySelector(DOMstrings.inputTime).value
            };
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();




// GLOBAL APP CONTROLLER
var controller = (function(eventCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddEvent);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddEvent();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteEvent);   
    };
   
    
    var ctrlAddEvent = function() {
        var input, newEvent;
        
        // 1. Get the field input data
        input = UICtrl.getInput();  
        console.log(input);      
        
        if (input.name !== "" && !isNaN(input.date) && input.date > 0) {
           
            // 2. Add the item to the budget controller
            newEvent = eventCtrl.addEvent(input.name, input.date, input.time);

            // 3. Add the item to the UI
            UICtrl.addEvent(newEvent);   

            // 4. Clear the fields
            UICtrl.clearFields();
        }
    };
    
    
    var ctrlDeleteEvent = function(event) {
        var itemID
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            // 1. delete the item from the data structure
            eventCtrl.deleteItem(itemID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
        }
    };
    
    return {
        init: function() {
            console.log('Application has started.');
            
            setupEventListeners();
        }
    };
    
})(eventController, UIController);


controller.init();