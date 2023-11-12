var uploaded_data = null;
var workout_plan = [];
var workout_config = {
	// keys:``
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
		parsed_data[i] = parsed_data[i].split(',');
	}
	
	return parsed_data;
}

function design_workout(parsed_data) {
	var valid_exercise_types = workout_config['valid_exercise_types'];
	var exercise_count = workout_config['exercise_count'];

	var valid_workouts = [];
	var valid_workouts_consumable = [];
	for(var row_index=0; row_index<parsed_data.length; row_index++){
		if(valid_exercise_types.includes(parsed_data[row_index][1])) {
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
	document.getElementById("workout_configuration").innerHTML="";
	if(uploaded_data) {
		var raw_data = uploaded_data;
	}
	else {
		var raw_data = read_exercise_csv("https://raw.githubusercontent.com/rachelwigell/exercise_app/main/exercises.csv");
	}
	var parsed_data = parse_exercise_csv(raw_data);
	design_workout(parsed_data);
	current_exercise = {
		'exercise_index': 0,
		'exercise_name': workout_plan[0][0],
		'set_index': 1,
		'working_time_remaining': workout_config['working_time'],
		'rest_time_remaining': COUNTDOWN_LENGTH,
		'exercise_image_url': workout_plan[0][2]
	}
	populate_countdown_screen();
	countdown_loop();
}

function read_uploaded_file(element) {
    var reader = new FileReader();

    reader.onload = function(file) {
        file_contents = file.target.result;
        uploaded_data = file_contents;
    };

    reader.readAsText(element.files[0]);
}