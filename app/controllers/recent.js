var args = arguments[0] || {};

function transformFunction(model) {
	var transform = model.toJSON();

	options_data = [];

	_.each(transform.options, function(option) {
		var row = Ti.UI.createTableViewRow({
			backgroundColor : "#0f0",
			height: 'auto'
		});
		var id = Ti.UI.createLabel({
			font : {
				fontSize : 16,
				fontWeight : 'bold',
				fontColor: "#000"
			},
			text : option.id,
			width : 32,
			height : 32,
			left : 4,
			top : 2
		});
		var value = Ti.UI.createLabel({
			text: option.value,
			font : {
				fontSize : 16,
				fontWeight : 'bold',
				fontColor: "#000"
			},
			width : 'auto',
			height: 'auto',
			textAlign : 'left',
			top : 2,
			left : 40
		});
		var poll = Ti.UI.createLabel({
			text : option.poll,
			font : {
				fontSize : 12,
				fontWeight : 'bold',
				fontColor: "#000"
			},
			width : 'auto',
			textAlign : 'left',
			bottom : 0,
			left : 60,
			height : 12
		});
		row.add(id);
		row.add(value);
		row.add(poll);

		row.addEventListener("click", function(e) {
			console.log(e);
		});
		options_data.push(row);
	});

	transform.options = options_data;

	return transform;
}

// var args = arguments[0] || {};
//
// function transformFunction(model) {
// var transform = model.toJSON();
//
// options_data = [];
// var section = Ti.UI.createListSection();
// var surveyDataSet = [];
// _.each(transform.options, function(option) {
// surveyDataSet.push({
// properties : {
// title : option.value,
// icon: "star_grey.png"
// }
// });
// });
//
// section.setItems(surveyDataSet);
// options_data.push(section);
//
// transform.options = options_data;
//
// return transform;
// }
//
// function handleClick(e) {
// // Get the section of the clicked item
// var section = $.list.sections[e.sectionIndex];
// // Get the clicked item from that section
// var item = section.getItemAt(e.itemIndex);
// // Update the item's `title` property and set it's color to red:
// item.properties.title += " (clicked)";
// item.properties.color = 'red';
// // Update the item in the list
// section.updateItemAt(e.itemIndex, item);
// }
//
// $.list.addEventListener('itemclick', function(e) {
// alert('Test');
// });

