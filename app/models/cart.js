module.exports = function Cart(oldCart){

	//Set Cart 
	this.items = oldCart.items || {}; //If cart have value use old cart items otherwise empty
	this.totalQty = oldCart.totalQty || 0; //Get oldcart quantity value otherwise set to 0
	this.totalPrice = oldCart.totalPrice || 0;//Get oldcart price value otherwise set to 0

	this.add = function(item, id){
		var storedItem = this.items[id];
		//If item.id cannot be found or oldCart is Empty create a new cart row
		if(!storedItem){
			storedItem = this.items[id] = { item: item, qty:0, price: 0};
		}
		//otherwise increment quantity of the selected object by one
		storedItem.qty++; //increment quantity
		storedItem.price = storedItem.item.price * storedItem.qty; //price per cart item

		this.totalQty++; //get total quantity
		this.totalPrice += storedItem.item.price; //get total individual price
	};

	this.generateArray = function(){
		var arr = [];
		for(var id in this.items){
			arr.push(this.items[id]);
		}
		return arr;
	};
};