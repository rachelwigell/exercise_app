var SUB_TO_TOP_LEVEL_MAPPING = {
	"chest": "upper",
	"shoulders": "upper",
	"biceps": "upper",
	"triceps": "upper",
	"forearms": "upper",
	"thighs": "lower",
	"calves": "lower",
	"abs": "core",
	"back": "core",
	"glutes": "core"
}
var TOP_TO_SUB_LEVEL_MAPPING = {
	"upper": ["chest", "shoulders", "biceps", "triceps", "forearms"],
	"lower": ["thighs", "calves"],
	"core": ["abs", "back", "glutes"]
}
var workout_plan = [];
var workout_config = {
	// keys:
	// exercise_count - the number of distinct exercises in the workout
	// set_count - the number of sets per exercise
	// working_time - working time per set
	// rest_time - length of rest between sets
	// valid_exercise_types_top_level - list of top-level exercise types (e.g. upper, lower) that are valid for this configuration
	// valid_exercise_types_sub_level - list of sub-level exercise types (e.g. chest, calves) that are valid for this configuration
};
var mode = "workout";

// data processing
function capture_workout_choices() {
	var exercise_count = document.getElementById("exercise_count").value;
	var set_count = document.getElementById("set_count").value;
	var working_time = document.getElementById("working_time").value;
	var rest_time = document.getElementById("rest_time").value;

	var valid_exercise_types_top_level = []
	var valid_exercise_types_sub_level = []
	if(document.getElementById("chest").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('upper')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('chest');
	}
	if(document.getElementById("shoulders").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('upper')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('shoulders');
	}
	if(document.getElementById("biceps").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('upper')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('biceps');
	}
	if(document.getElementById("triceps").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('upper')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('triceps');
	}
	if(document.getElementById("forearms").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('upper')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('forearms');
	}
	if(document.getElementById("thighs").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('lower')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('thighs');
	}
	if(document.getElementById("calves").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('lower')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('calves');
	}
	if(document.getElementById("abs").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('core')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('abs');
	}
	if(document.getElementById("back").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('core')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('back');
	}
	if(document.getElementById("glutes").checked) {
		valid_exercise_types_top_level = valid_exercise_types_top_level.concat('core')
		valid_exercise_types_sub_level = valid_exercise_types_sub_level.concat('glutes');
	}

	// deduplicate
	valid_exercise_types_top_level = new Set(valid_exercise_types_top_level);
	valid_exercise_types_top_level = Array.from(valid_exercise_types_top_level);

	workout_config['exercise_count'] = exercise_count;
	workout_config['set_count'] = set_count;
	workout_config['working_time'] = working_time;
	workout_config['rest_time'] = rest_time;
	workout_config['valid_exercise_types_top_level'] = valid_exercise_types_top_level;
	workout_config['valid_exercise_types_sub_level'] = valid_exercise_types_sub_level;
	workout_config['include_warmup'] = document.getElementById("warmup").checked;
	workout_config['include_cooldown'] = document.getElementById("cooldown").checked;
	workout_config['plan_only'] = document.getElementById("plan_only").checked;
}

function design_workout(parsed_data) {
	var valid_exercise_types_top_level = workout_config['valid_exercise_types_top_level'];
	var valid_exercise_types_sub_level = workout_config['valid_exercise_types_sub_level'];
	var exercise_count = workout_config['exercise_count'];

	var valid_workouts = {};
	var valid_workouts_consumable = {};

	if(valid_exercise_types_top_level.includes("upper")) {
		valid_workouts["upper"] = {};
		valid_workouts_consumable["upper"] = {};
	}
	if(valid_exercise_types_top_level.includes("lower")) {
		valid_workouts["lower"] = {};
		valid_workouts_consumable["lower"] = {};
	}
	if(valid_exercise_types_top_level.includes("core")) {
		valid_workouts["core"] = {};
		valid_workouts_consumable["core"] = {};
	}

	if(valid_exercise_types_sub_level.includes("chest")) {
		valid_workouts["upper"]["chest"] = [];
		valid_workouts_consumable["upper"]["chest"] = [];
	}
	if(valid_exercise_types_sub_level.includes("shoulders")) {
		valid_workouts["upper"]["shoulders"] = [];
		valid_workouts_consumable["upper"]["shoulders"] = [];
	}
	if(valid_exercise_types_sub_level.includes("biceps")) {
		valid_workouts["upper"]["biceps"] = [];
		valid_workouts_consumable["upper"]["biceps"] = [];
	}
	if(valid_exercise_types_sub_level.includes("triceps")) {
		valid_workouts["upper"]["triceps"] = [];
		valid_workouts_consumable["upper"]["triceps"] = [];
	}
	if(valid_exercise_types_sub_level.includes("forearms")) {
		valid_workouts["upper"]["forearms"] = [];
		valid_workouts_consumable["upper"]["forearms"] = [];
	}
	if(valid_exercise_types_sub_level.includes("thighs")) {
		valid_workouts["lower"]["thighs"] = [];
		valid_workouts_consumable["lower"]["thighs"] = [];
	}
	if(valid_exercise_types_sub_level.includes("calves")) {
		valid_workouts["lower"]["calves"] = [];
		valid_workouts_consumable["lower"]["calves"] = [];
	}
	if(valid_exercise_types_sub_level.includes("abs")) {
		valid_workouts["core"]["abs"] = [];
		valid_workouts_consumable["core"]["abs"] = [];
	}
	if(valid_exercise_types_sub_level.includes("back")) {
		valid_workouts["core"]["back"] = [];
		valid_workouts_consumable["core"]["back"] = [];
	}
	if(valid_exercise_types_sub_level.includes("glutes")) {
		valid_workouts["core"]["glutes"] = [];
		valid_workouts_consumable["core"]["glutes"] = [];
	}
	
	for(var row_index=0; row_index<parsed_data.length; row_index++){
		var sub_level_type = parsed_data[row_index]['exercise_type'];
		if(valid_exercise_types_sub_level.includes(sub_level_type)) {
			var top_level_type = SUB_TO_TOP_LEVEL_MAPPING[sub_level_type];
			valid_workouts[top_level_type][sub_level_type].push(parsed_data[row_index]);
			valid_workouts_consumable[top_level_type][sub_level_type].push(parsed_data[row_index]);
		}
	}

	for(var exercise_num=0; exercise_num<exercise_count; exercise_num++) {
		// weighting to make the types equally likely
		// start with picking top-level type
		var chosen_top_level_type = valid_exercise_types_top_level[random_range(0, valid_exercise_types_top_level.length)];
		// pick sub type
		var valid_sub_types = array_intersection(valid_exercise_types_sub_level, TOP_TO_SUB_LEVEL_MAPPING[chosen_top_level_type]);
		var chosen_sub_level_type = valid_sub_types[random_range(0, valid_sub_types.length)];
		// pick specific exercise
		var chosen_index = random_range(0, valid_workouts_consumable[chosen_top_level_type][chosen_sub_level_type].length);
		workout_plan.push(valid_workouts_consumable[chosen_top_level_type][chosen_sub_level_type][chosen_index]);
		valid_workouts_consumable[chosen_top_level_type][chosen_sub_level_type].splice(chosen_index, 1);
		
		if(valid_workouts_consumable[chosen_top_level_type][chosen_sub_level_type].length == 0) {
			valid_workouts_consumable[chosen_top_level_type][chosen_sub_level_type] = deep_copy(valid_workouts[chosen_top_level_type][chosen_sub_level_type]);
		}
	}
}

function design_pt_workout(parsed_data) {
	var exercise_count = workout_config['exercise_count'];

	var valid_workouts = [];
	var valid_workouts_consumable = [];

	for(var row_index=0; row_index<parsed_data.length; row_index++){
			valid_workouts.push(parsed_data[row_index]);
			valid_workouts_consumable.push(parsed_data[row_index]);
	}

	for(var exercise_num=0; exercise_num<exercise_count; exercise_num++) {
		var chosen_index = random_range(0, valid_workouts_consumable.length);
		var chosen_workout = valid_workouts_consumable[chosen_index];
		if(chosen_workout['exercise_sidedness']){
			chosen_workout_copy = deep_copy_hash(chosen_workout);
			chosen_workout_copy['exercise_name'] += ' (left)'
			workout_plan.push(chosen_workout_copy)
			chosen_workout['exercise_name'] += ' (right)'
			workout_plan.push(chosen_workout)
		}
		else {
			workout_plan.push(chosen_workout);
		}
		valid_workouts_consumable.splice(chosen_index, 1);
		
		if(valid_workouts_consumable.length == 0) {
			valid_workouts_consumable = deep_copy(valid_workouts);
		}
	}
}

function process_choices() {
	capture_workout_choices();
	if(uploaded_data) {
		var raw_data = uploaded_data;
	}
	else {
		if(mode == "workout") {
			var raw_data = read_exercise_csv("https://raw.githubusercontent.com/rachelwigell/exercise_app/main/assets/exercises.csv");
		}
		else if(mode == "PT") {
			var raw_data = read_exercise_csv("https://raw.githubusercontent.com/rachelwigell/exercise_app/main/assets/PT.csv");
		}
	}
	var parsed_data = parse_exercise_csv(raw_data);
	if(parsed_data != "errors encountered") {
		document.getElementById("workout_configuration").innerHTML="";
		document.getElementById("mode_choice").innerHTML="";
		if(mode == "workout") {
			design_workout(parsed_data);
		}
		else if(mode == "PT") {
			design_pt_workout(parsed_data);
		}
		current_exercise = {
			'exercise_index': 0,
			'exercise_name': workout_plan[0]['exercise_name'],
			'set_index': 1,
			'working_time_remaining': workout_config['working_time'],
			'rest_time_remaining': COUNTDOWN_LENGTH,
			'exercise_image_url': workout_plan[0]['exercise_image'],
			'exercise_note': workout_plan[0]['exercise_note']
		}
		if(workout_config['plan_only']){
			populate_plan_screen();
		}
		else {
			start_warmup();
		}
	}
}

function start_warmup() {	
	if(workout_config["include_warmup"] && mode != "PT"){
		update_warmup_cooldown_screen("warmup", "populate");
		warmup_end();
	}
	else {
		start_main_workout();
	}
}

function start_cooldown() {
	document.getElementById("pause_button").innerHTML="";
	document.getElementById("skip_button").innerHTML="";
	document.getElementById("workout_progress").innerHTML="";

	if(workout_config["include_cooldown"] && mode != "PT"){
		update_warmup_cooldown_screen("cooldown", "populate");
		cooldown_end();
	}
	else {
		populate_end_screen();
	}
}

function start_main_workout() {
	update_warmup_cooldown_screen("warmup", "clear");
	clearInterval(interval);
	populate_countdown_screen();
	countdown_loop();
}

// stretching

function process_stretch_choices() {
	if(uploaded_data) {
		var raw_data = uploaded_data;
	}
	else {
		var raw_data = read_exercise_csv("https://raw.githubusercontent.com/rachelwigell/exercise_app/main/assets/stretches.csv");
	}
	workout_plan = parse_stretch_csv(raw_data);
	console.log(workout_plan);
	workout_config['exercise_count'] = workout_plan.length;
	workout_config['set_count'] = 1;
	workout_config['rest_time'] = 0;
	console.log(workout_config);

	document.getElementById("stretch_configuration").innerHTML="";
	document.getElementById("mode_choice").innerHTML="";
	current_exercise = {
		'exercise_index': 0,
		'exercise_name': workout_plan[0]['stretch_name'],
		'set_index': 1,
		'working_time_remaining': workout_plan[0]['stretch_length_seconds'],
		'rest_time_remaining': COUNTDOWN_LENGTH,
		'exercise_image_url': undefined,
		'exercise_note': ""
	}
	start_main_workout();
}

// bike

function design_bike_workout(difficulty, style, duration) {
	BASE_REST_SPEED = 10;
	BASE_CHALLENGE_SPEED = 15;

	workout_plan = [];
	
	if(style == "frequent") {
		// 1 minute warmup
		// 1 minute long challenges separated by 1 minute long rests
		// 1 minute cooldown
		num_exercises = Math.floor((duration-2)/2);
		workout_config['exercise_count'] = num_exercises;
		workout_config['working_time'] = 60;
		workout_config['rest_time'] = 60;
		workout_config['set_count'] = 1;

		var speed_target = Math.floor(BASE_REST_SPEED + difficulty + random_range_continuous(-2, 1));
		workout_plan.push({
			"challenge_name": "warmup",
			"challenge_speed_target": speed_target,
			"rest_speed_target": speed_target
		});

		for(i=0; i<num_exercises; i++) {
			var challenge_speed_target = Math.floor(BASE_CHALLENGE_SPEED + difficulty + random_range_continuous(-1, 1)*difficulty/2);
			var rest_speed_target = Math.floor(BASE_REST_SPEED + difficulty + random_range_continuous(-1, 1));
			var choice = random_range(0, 3);

			if(choice == 0) {
				workout_plan.push({
					"challenge_name": "resistance",
					"challenge_speed_target": challenge_speed_target,
					"rest_speed_target": rest_speed_target
				});
			}
			else if(choice == 1) {
				workout_plan.push({
					"challenge_name": "rpm",
					"challenge_speed_target": challenge_speed_target,
					"rest_speed_target": rest_speed_target
				});
			}
			else {
				workout_plan.push({
					"challenge_name": "stand",
					"challenge_speed_target": challenge_speed_target,
					"rest_speed_target": rest_speed_target
				});
			}
		}

		var speed_target = Math.floor(BASE_REST_SPEED + difficulty + random_range_continuous(-2, 1));
		workout_plan.push({
			"challenge_name": "cooldown",
			"challenge_speed_target": speed_target,
			"rest_speed_target": speed_target
		});
	}
	else {
		// todo
	}
}

function process_bike_choices() {
	var difficulty = document.getElementById("bike_level").value*1;
	var style = document.querySelector('input[name="bike_style"]:checked').value;
	var duration = document.getElementById("bike_length").value;
	design_bike_workout(difficulty, style, duration);

	console.log(workout_plan);
	console.log(workout_config);

	document.getElementById("bike_configuration").innerHTML="";
	document.getElementById("mode_choice").innerHTML="";
	current_exercise = {
		'exercise_index': 0,
		'exercise_name': bike_display_text(true, workout_plan[0]),
		'set_index': 1,
		'working_time_remaining': workout_config["working_time"],
		'rest_time_remaining': COUNTDOWN_LENGTH,
		'exercise_image_url': undefined,
		'exercise_note': "",
		'config': workout_plan[0]
	}
	start_main_workout();
}

function bike_display_text(working, config) {
	if(working) {
		if(config["challenge_name"] == 'warmup') {
			return "Let's warm up. Set resistance to a comfortable level, and try to maintain a speed of at least " + config["challenge_speed_target"] + ".";
		}
		else if(config["challenge_name"] == 'cooldown') {
			return "Let's cool down. Set resistance to a comfortable level, and try to maintain a speed of at least " + config["challenge_speed_target"] + ".";
		}
		else if(config["challenge_name"] == 'resistance') {
			return "Raise the resistance and try to maintain a speed of at least " + config["challenge_speed_target"] + ".";
		}
		else if(config["challenge_name"] == 'rpm') {
			return "Keep resistance low, and try to maintain a speed of at least " + config["challenge_speed_target"] + " by raising your RPM.";
		}
		else {
			return "Stand up! Try to maintain a speed of at least " + config["challenge_speed_target"] + ".";
		}
	}
	else {
		return "Take a break. Set resistance to a comfortable level, and maintain a speed of about " + config["rest_speed_target"] + ".";
	}
}