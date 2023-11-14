var uploaded_data = null;

function read_uploaded_file(element) {
    var reader = new FileReader();

    reader.onload = function(file) {
        file_contents = file.target.result;
        uploaded_data = file_contents;
    };

    reader.readAsText(element.files[0]);
}

function read_exercise_csv(csv_url) {
	var data = $.ajax({
        type: "GET",
        url: csv_url,
        dataType: "text",
        async: false
     }).responseText;

	return data;
}

function parse_exercise_csv(raw_data) {
	var parsed_data = raw_data.split('\n');
	for(var i=0; i<parsed_data.length; i++) {
		var raw_row = parsed_data[i].split(',')
		var parsed_row = parse_csv_row(raw_row, i);
		if(parsed_row == 'errors encountered') {
			return 'errors encountered';
		}
		else {
			parsed_data[i] = parsed_row;
		}
	}
	return parsed_data;
}

function parse_csv_row(row, index) {
	var parsed_row = {};
	var errors_encountered = false;

	var exercise_name = parse_csv_item(row[0], 'exercise_name');
	if(exercise_name == 'item missing') {
		set_error_message("Exercise name missing on row " + index);
		errors_encountered = true;
	}
	else {
		parsed_row['exercise_name'] = exercise_name;
	}

	var exercise_type = parse_csv_item(row[1], 'exercise_type');
	if(exercise_type == 'item missing') {
		set_error_message("Exercise type missing on row " + index+1);
		errors_encountered = true;
	}
	else if(exercise_type == 'item malformed') {
		set_error_message("Exercise type is invalid on row " + index+1 + ". Should be one of: abs, back, thighs, calves, chest, biceps, triceps, shoulders, or forearms");
		errors_encountered = true;
	}
	else {
		parsed_row['exercise_type'] = exercise_type;
	}

	parsed_row['exercise_image'] = parse_csv_item(row[2], 'exercise_image');

	if(errors_encountered) {
		return 'errors encountered';
	}
	else {
		return parsed_row;
	}
}

function parse_csv_item(item, item_type) {
	if(item_type == "exercise_name") {
		if(item == undefined || item == '') {
			return 'item missing';
		}
		else {
			return item;
		}
	}

	if(item_type == "exercise_type") {
		item = item.toLowerCase();
		if(item == undefined || item == '') {
			return 'item missing';
		}
		else if(![
				"abs", "back",
				"thighs", "calves",
				"chest", "shoulders", "forearms", "biceps", "triceps"
			].includes(item)) {
			return 'item malformed';
		}
		else {
			return item;
		}
	}

	if(item_type == "exercise_image") {
		if(item == undefined || item == '') {
			return undefined;
		}
		else {
			return item;
		}
	}
}

function set_error_message(message) {
	document.getElementById("error_messages").innerHTML="Error encountered parsing your CSV: " + message;
}

