function show_working_and_total_time() {
	var exercise_count = document.getElementById("exercise_count").value;
	var set_count = document.getElementById("set_count").value;
	var working_time = document.getElementById("working_time").value;
	var rest_time = document.getElementById("rest_time").value;

	var total_working_time = exercise_count*set_count*working_time;
	var total_rest_time = rest_time * (exercise_count*set_count-1)+COUNTDOWN_LENGTH;
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
	if(exercise_image_url == undefined){
		var exercise_image_htl = "";
	}
	else {
		var exercise_image_html = `<img src="${exercise_image_url}">`;
	}

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

$('#upper').click(function() {
    if ($(this).is(':checked')) {
        $('#chest').attr('checked', true);
        $('#shoulders').attr('checked', true);
        $('#biceps').attr('checked', true);
        $('#triceps').attr('checked', true);
        $('#forearms').attr('checked', true);
    } else {
        $('#chest').attr('checked', false);
        $('#shoulders').attr('checked', false);
        $('#biceps').attr('checked', false);
        $('#triceps').attr('checked', false);
        $('#forearms').attr('checked', false);
    }
});

$('#lower').click(function() {
    if ($(this).is(':checked')) {
        $('#thighs').attr('checked', true);
        $('#calves').attr('checked', true);
    } else {
        $('#thighs').attr('checked', false);
        $('#calves').attr('checked', false);
    }
});

$('#core').click(function() {
    if ($(this).is(':checked')) {
        $('#abs').attr('checked', true);
        $('#back').attr('checked', true);
    } else {
        $('#abs').attr('checked', false);
        $('#back').attr('checked', false);
    }
});