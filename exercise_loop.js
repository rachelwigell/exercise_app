var COUNTDOWN_LENGTH = 10;
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

show_working_and_total_time();

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
			current_exercise['exercise_name'] = workout_plan[current_exercise['exercise_index']]['exercise_name'];
			current_exercise['exercise_image_url'] = workout_plan[current_exercise['exercise_index']]['exercise_image'];
		}
		else {
			populate_end_screen();
		}
	}
}