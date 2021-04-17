// global variables
var countdown_length = 2;
var uploaded_data = null;
var workout_config = {
	// keys:
	// exercise_count - the number of distinct exercises in the workout
	// set_count - the number of sets per exercise
	// working_time - working time per set
	// rest_time - length of rest between sets
	// valid_exercise_types - list of exercise types (e.g. upper, lower) that are valid for this configuration
};
var workout_plan = [];
var current_exercise = {
	// keys:
	// exercise_name
	// exercise_index - current exercise count (0-based)
	// set_index - current set count (1-based)
	// working_time_remaining
	// rest_time_remaining
	// exercise_image_url

};
var interval = null;

// function calls
show_working_and_total_time();

// control flow
function exercise_loop() {
	interval = setInterval(update_exercise, 1000);
}

function rest_loop() {
	interval = setInterval(update_rest, 1000);
}

function countdown_loop() {
	interval = setInterval(update_countdown, 1000);
}

function pause_workout() {
	clearInterval(interval);
	switch_button("resume_workout");
}

function resume_workout() {
	interval = setInterval(update_exercise, 1000);
	switch_button("pause_workout");
}

function pause_rest() {
	clearInterval(interval);
	switch_button("resume_rest");
}

function resume_rest() {
	interval = setInterval(update_rest, 1000);
	switch_button("pause_rest");
}

function skip_workout() {
	current_exercise['working_time_remaining'] = 0;
	clearInterval(interval);
	resume_workout();
	populate_exercise_screen();
}

function skip_rest() {
	current_exercise['rest_time_remaining'] = 0;
	clearInterval(interval);
	resume_rest();
	populate_rest_screen();
}

// update HTML
function show_working_and_total_time() {
	var exercise_count = document.getElementById("exercise_count").value;
	var set_count = document.getElementById("set_count").value;
	var working_time = document.getElementById("working_time").value;
	var rest_time = document.getElementById("rest_time").value;

	var total_working_time = exercise_count*set_count*working_time;
	var total_rest_time = rest_time * (exercise_count*set_count-1)+countdown_length;
	var total_time = total_working_time + total_rest_time;
	total_working_time = seconds_to_readable_string(total_working_time);
	total_time = seconds_to_readable_string(total_time);
	total_working_time_html = `<b>Total working time:</b> ${total_working_time}`;
	total_workout_length_html = `<b>Total workout length:</b> ${total_time}`;

	document.getElementById("total_working_time").innerHTML=total_working_time_html; 
	document.getElementById("total_workout_length").innerHTML=total_workout_length_html; 
}

function populate_exercise_screen() {
	var exercise_name = current_exercise['exercise_name'];
	var set_index = current_exercise['set_index'];
	var working_time_remaining = current_exercise['working_time_remaining'];
	var workout_header = `${exercise_name} (set ${set_index})`;
	var exercise_image_url = current_exercise['exercise_image_url'];
	var exercise_image_html = `<img src="${exercise_image_url}">`;

	document.getElementById("message").innerHTML="It's go time!";
	document.getElementById("exercise_name").innerHTML=workout_header;
	document.getElementById("exercise_image").innerHTML=exercise_image_html;
	document.getElementById("countdown").innerHTML=progress_bar_html(value_to_percentage('exercise'));
	document.getElementById("workout_progress").innerHTML=progress_bar_html(value_to_percentage('workout'));
	switch_button("pause_workout");
}

function populate_rest_screen() {
	var next_exercise_name = current_exercise['exercise_name']
	var set_index = current_exercise['set_index']
	var rest_time_remaining = current_exercise['rest_time_remaining']
	var workout_header = `Next exercise: ${next_exercise_name} (set ${set_index})`
	var exercise_image_url = current_exercise['exercise_image_url'];
	var exercise_image_html = `<img src="${exercise_image_url}">`;

	document.getElementById("message").innerHTML="Rest time! Grab some water.";
	document.getElementById("exercise_name").innerHTML=workout_header;
	document.getElementById("exercise_image").innerHTML=exercise_image_html;
	document.getElementById("countdown").innerHTML=progress_bar_html(value_to_percentage('rest'));
	switch_button("pause_rest");
}

function switch_button(button_choice) {
	if(button_choice == "pause_workout") {
		var button_html = '<button type="button" id="pause_button" onClick="pause_workout()"><h1>Pause</h1></button>';
		var skip_html = '<button type="button" id="skip_button" onClick="skip_workout()"><h1>Skip &gt;&gt;</h1></button>';
	}
	else if(button_choice == "resume_workout") {
		var button_html = '<button type="button" id="pause_button" onClick="resume_workout()"><h1>Resume</h1></button>';
		var skip_html = '<button type="button" id="skip_button" onClick="skip_workout()"><h1>Skip &gt;&gt;</h1></button>';
	}
	else if(button_choice == "pause_rest") {
		var button_html = '<button type="button" id="pause_button" onClick="pause_rest()"><h1>Pause</h1></button>';
		var skip_html = '<button type="button" id="skip_button" onClick="skip_rest()"><h1>Skip &gt;&gt;</h1></button>';
	}
	else if(button_choice == "resume_rest") {
		var button_html = '<button type="button" id="pause_button" onClick="resume_rest()"><h1>Resume</h1></button>';
		var skip_html = '<button type="button" id="skip_button" onClick="skip_rest()"><h1>Skip &gt;&gt;</h1></button>';
	}
	document.getElementById("pause_button").innerHTML=button_html;
	document.getElementById("skip_button").innerHTML=skip_html;
}

function clear_screen(){
	document.getElementById("message").innerHTML="";
	document.getElementById("exercise_name").innerHTML="";
	document.getElementById("exercise_image").innerHTML="";
	document.getElementById("countdown").innerHTML="";
}

function populate_end_screen() {
	clear_screen();
	document.getElementById("pause_button").innerHTML="";
	document.getElementById("skip_button").innerHTML="";
	document.getElementById("workout_progress").innerHTML="";
	document.getElementById("message").innerHTML="All done! Way to go.";
}

function progress_bar_html(value){
	return `<progress value="${value}" max="1"></progress>`
}

function populate_countdown_screen(){
	var next_exercise_name = current_exercise['exercise_name']
	var rest_time_remaining = current_exercise['rest_time_remaining']
	var exercise_image_url = current_exercise['exercise_image_url'];
	var exercise_image_html = `<img src="${exercise_image_url}">`;

	document.getElementById("message").innerHTML="Get ready to start! Your first exercise will be...";
	document.getElementById("exercise_name").innerHTML=next_exercise_name;
	document.getElementById("exercise_image").innerHTML=exercise_image_html;
	document.getElementById("countdown").innerHTML=rest_time_remaining;
}

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
		'rest_time_remaining': countdown_length,
		'exercise_image_url': workout_plan[0][2]
	}
	populate_countdown_screen();
	countdown_loop();
}

function update_exercise(){
	var working_time_remaining = current_exercise['working_time_remaining'];
	if(working_time_remaining > 1){
		current_exercise['working_time_remaining'] -= 1;
		populate_exercise_screen();
	}
	else {
		play_bell_sound();
		clearInterval(interval);
		clear_screen();
		increment_exercise_or_set();
		if(current_exercise['exercise_index'] < workout_config['exercise_count']) {
			populate_rest_screen();
			rest_loop();
		}
	}
}

function update_rest() {
	var rest_time_remaining = current_exercise['rest_time_remaining'];
	if(rest_time_remaining > 1){
		current_exercise['rest_time_remaining'] -= 1;
		populate_rest_screen();
	}
	else {
		play_bell_sound();
		clearInterval(interval);
		clear_screen();
		populate_exercise_screen();
		exercise_loop();
	}
}

function update_countdown() {
	var rest_time_remaining = current_exercise['rest_time_remaining'];
	if(rest_time_remaining > 1){
		current_exercise['rest_time_remaining'] -= 1;
		populate_countdown_screen();
	}
	else {
		play_bell_sound();
		clearInterval(interval);
		clear_screen();
		populate_exercise_screen();
		exercise_loop();
	}
}

function increment_exercise_or_set(){
	if(current_exercise['set_index'] < workout_config['set_count']) {
		current_exercise['set_index'] += 1;
		current_exercise['working_time_remaining'] = workout_config['working_time'];
		current_exercise['rest_time_remaining'] = workout_config['rest_time'];
	}
	else {
			current_exercise['set_index'] = 1;
			current_exercise['exercise_index'] += 1;
			current_exercise['working_time_remaining'] = workout_config['working_time'];
			current_exercise['rest_time_remaining'] = workout_config['rest_time'];
		if(current_exercise['exercise_index'] < workout_config['exercise_count']) {
			current_exercise['exercise_name'] = workout_plan[current_exercise['exercise_index']][0];
			current_exercise['exercise_image_url'] = workout_plan[current_exercise['exercise_index']][2];
		}
		else {
			populate_end_screen();
		}
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

// helpers
function seconds_to_readable_string(seconds) {
	var readable = new Date(seconds * 1000).toISOString().substr(11, 8);
	var readable = readable.replace(":", " hours ");
	var readable = readable.replace(":", " minutes ");
	var readable = readable + " seconds";
	return readable;
}

function deep_copy(array_of_arrays) {
	var new_array = [];
	for(var i=0; i<array_of_arrays.length; i++){
		new_array[i] = []
		for(var j=0; j<array_of_arrays[i].length; j++){
			new_array[i][j] = array_of_arrays[i][j];
		}
	}
	return new_array;
}

function random_range(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function value_to_percentage(progress_type) {
	if(progress_type == 'exercise') {
		var max_value = workout_config['working_time'];
		var current_value = current_exercise['working_time_remaining']-1;
		current_value = max_value-current_value;
	}
	else if(progress_type == 'workout') {
		var exercises_in_workout = workout_config['exercise_count'];
		var set_count = workout_config['set_count'];
		var exercise_index = current_exercise['exercise_index'];
		var current_set_index = current_exercise['set_index'];
		var max_value = exercises_in_workout*set_count;
		var current_value = exercise_index*set_count+current_set_index;
	}
	else {
		var max_value = workout_config['rest_time'];
		var current_value = current_exercise['rest_time_remaining']-1;
		current_value = max_value-current_value;
	}
	return current_value/max_value;
}

function play_bell_sound(){
	var audio = new Audio('bell.wav');
	audio.play();
}