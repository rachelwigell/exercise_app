function seconds_to_readable_string(seconds) {
	var readable = new Date(seconds * 1000).toISOString().substr(11, 8);
	var readable = readable.replace(":", " hours ");
	var readable = readable.replace(":", " minutes ");
	var readable = readable + " seconds";
	return readable;
}

function deep_copy(array_of_hashes) {
	var new_array = [];
	for(var i=0; i<array_of_hashes.length; i++){
		var row = array_of_hashes[i];
		new_array[i] = {
			"exercise_name": row["exercise_name"],
			"exercise_type": row["exercise_type"],
			"exercise_image": row["exercise_image"]
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

function progress_bar_html(value){
	return `<progress value="${value}" max="1"></progress>`
}