var uploaded_data = null;
var workout_plan = [];
var workout_config = {
	// keys:
	// exercise_count - the number of distinct exercises in the workout
	// set_count - the number of sets per exercise
	// working_time - working time per set
	// rest_time - length of rest between sets
	// valid_exercise_types - list of exercise types (e.g. upper, lower) that are valid for this configuration
};

// data processing
function capture_workout_choices() {
	var exercise_count = document.getElementById("exercise_count").value;
	var set_count = document.getElementById("set_count").value;
	var working_time = document.getElementById("working_time").value;
	var rest_time = document.getElementById("rest_time").value;

	var valid_exercise_types = []
	if(document.getElementById("upper").checked) { valid_exercise_types = valid_exercise_types.concat('upper'); }
	if(document.getElementById("lower").checked) { valid_exercise_types = valid_exercise_types.concat('lower'); }
	if(document.getElementById("core").checked) { valid_exercise_types = valid_exercise_types.concat('core'); }

	workout_config['exercise_count'] = exercise_count;
	workout_config['set_count'] = set_count;
	workout_config['working_time'] = working_time;
	workout_config['rest_time'] = rest_time;
	workout_config['valid_exercise_types'] = valid_exercise_types;
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
		set_error_message("Exercise type is invalid on row " + index+1 + ". Should be one of: upper, lower, or core.");
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
		else if(!(item == 'upper' || item == 'lower' || item == 'core')) {
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

function design_workout(parsed_data) {
	var valid_exercise_types = workout_config['valid_exercise_types'];
	var exercise_count = workout_config['exercise_count'];

	var valid_workouts = [];
	var valid_workouts_consumable = [];
	for(var row_index=0; row_index<parsed_data.length; row_index++){
		if(valid_exercise_types.includes(parsed_data[row_index]['exercise_type'])) {
			valid_workouts.push(parsed_data[row_index]);
			valid_workouts_consumable.push(parsed_data[row_index]);
		}
	}
	
	for(var execise_num=0; execise_num<exercise_count; execise_num++) {
		var chosen_index = random_range(0, valid_workouts_consumable.length);
		workout_plan.push(valid_workouts_consumable[chosen_index]);
		valid_workouts_consumable.splice(chosen_index, 1);
		if(valid_workouts_consumable.length == 0) {
			valid_workouts_consumable = deep_copy(valid_workouts);
		}
	}
}

function start_workout() {
	capture_workout_choices();
	if(uploaded_data) {
		var raw_data = uploaded_data;
	}
	else {
		var raw_data = read_exercise_csv("https://raw.githubusercontent.com/rachelwigell/exercise_app/main/exercises.csv");
	}
	var parsed_data = parse_exercise_csv(raw_data);
	if(parsed_data != "errors encountered") {
		document.getElementById("workout_configuration").innerHTML="";
		design_workout(parsed_data);
		current_exercise = {
			'exercise_index': 0,
			'exercise_name': workout_plan[0]['exercise_name'],
			'set_index': 1,
			'working_time_remaining': workout_config['working_time'],
			'rest_time_remaining': COUNTDOWN_LENGTH,
			'exercise_image_url': workout_plan[0]['exercise_image']
		}
		populate_countdown_screen();
		countdown_loop();
	}
}

function read_uploaded_file(element) {
    var reader = new FileReader();

    reader.onload = function(file) {
        file_contents = file.target.result;
        uploaded_data = file_contents;
    };

    reader.readAsText(element.files[0]);
}