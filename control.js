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