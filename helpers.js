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
			"exercise_image": row["exercise_image"],
			"exercise_note": row["exercise_note"]
		}
	}
	return new_array;
}

function deep_copy_hash(hash) {
	return {
		"exercise_name": hash["exercise_name"],
		"exercise_type": hash["exercise_type"],
		"exercise_image": hash["exercise_image"],
		"exercise_note": hash["exercise_note"]
	}
}

function random_range(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function value_to_percentage(progress_type) {
	if(progress_type == 'exercise') {
		if(mode == "stretch"){
			var max_value = workout_plan[current_exercise['exercise_index']]['stretch_length_seconds']
		}
		else{
			var max_value = workout_config['working_time'];
		}
		var current_value = current_exercise['working_time_remaining']-1;
		current_value = max_value-current_value;
	}
	else if(progress_type == 'workout') {
		var exercises_in_workout = workout_plan.length;
		var set_count = workout_config['set_count'];
		var exercise_index = current_exercise['exercise_index'];
		var current_set_index = current_exercise['set_index'];
		var max_value = exercises_in_workout*set_count;
		var current_value = exercise_index*set_count+current_set_index;
	}
	else {
		var max_value = parseInt(workout_config['rest_time']);
		if(current_exercise['set_index'] == 1) {
			max_value += setup_time();
		}
		var current_value = current_exercise['rest_time_remaining']-1;
		current_value = max_value-current_value;
	}
	return current_value/max_value;
}

function play_bell_sound() {
	var audio = new Audio('bell.wav');
	audio.play();
}

function progress_bar_html(value) {
	return `<progress value="${value}" max="1"></progress>`
}

function array_intersection(arr1, arr2) {
    var intersection = [];
    for(var i=0; i<arr1.length; i++){
    	var item = arr1[i];
    	if(arr2.includes(item)) {
    		intersection.push(item)
    	}
    }
    return intersection; 
} 

function image_html(exercise_image_url){
	if(exercise_image_url == undefined){
		return exercise_image_html = "";
	}
	else {
		return exercise_image_html = `<img src="${exercise_image_url}">`;
	}
}

function setup_time(){
	if(mode == "PT") { return 15; }
	else { return 0; }
}