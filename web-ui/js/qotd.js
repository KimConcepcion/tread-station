var qotd_workout_text = [
	"Get ripped, get laid.",
	"Pain is weakness leaving the body",
	"Being defeated is often a temporary condition. Giving up is what makes it permanent.",
	"Failure is only a temporary change in direction to set you straight for your next success.",
	"If you fail to prepare, you prepare to fail",
	"The worst thing you can be is average.",
	"Go hard or go home.",
	"EAT BIG, LIFT BIG, GET BIG!",
	"When it starts to hurt, thats when the set starts.",
	"THE HARDEST THING ABOUT EARNING A TITLE IS THE ABILITY TO LIVE UP TO IT",
	"With great size comes great responsibility",
	"Ain’t nothing to it but to do it.",
	"I’m not here to talk.",
	"Squat till you puke.",
	"To achieve something you’ve never had before, you must do something you’ve never done before.",
	"Doubt me, hate me, you’re the inspiration I need",
	"You are born weak and die weak, what you are in between those two periods of time is up to you",
	"I don’t care how many reps you do, as long as you lift girl weights you’ll get a girl body!",
	"Strength Within, Pride Throughout",
	"Hard work beats talent when talent doesn’t work hard.",
	"Winners Train, Losers Complain.",
	"A winner never whines.",
	"You don’t demand respect, you earn it.",
	"Good is not enough if better is possible.",
	"If the bar ain’t bending you‘re just pretending",
	"Character is who you are when no one’s watching",
	"The only time Success comes before Work is in the dictionary",
	"I had the goal to be the best from day one.",
	"No pain, no gain!",
	"Everybody wanna be a bodybuilder, but don’t nobody wanna lift no heavy ass weights!!",
	"Never say the skys the limit when there are footprints on the moon.",
	"More pain, more pussy",
	"Life´s too short to be small",
	"Expecting the world to treat you fairly because you’re an honest person is like expecting the bull not to charge you because you’re a vegetarian.",
	"Be proud, but never satisfied.",
	"Some people want it to happen, some wish it would happen, others make it happen.",
	"Only you get out, what you put in",
	"If you dont live for something you’ll die for nothing",
	"You must do what others don’t, to achieve what others won’t",
	"Yeah, I had a girlfriend once, but she couldn’t spot me, so what was the point?",
	"Obsession is what lazy people call dedication.",
	"The worst thing I can be is the same as everybody else. I hate that.",
	"For every person who doubts you, tell you that you will fail, try twice as hard to prove them wrong.",
	"Cardio? Is that spanish?",
	"Build your body, build your character",
	"i do it because i can, i can because i want to, i want to because you said i couldn’t",
	"I’m not on steroids, but thanks for asking…",
	"STAY WEAK. I needed those plates anyway.",
	"I got 99 problems but a BENCH ain’t one.",
	"When the going gets tough the tough gets going",
	"If you’re not first, you’re last.",
	"you cant flex fat so shut up and lift",
	"train hard, so they dig deeper than 6 feet into the ground.",
	"You want results, then train like it",
	"Light days? Whats that? … Some kind of tampon?",
	"Fall down seven times, get up eight.",
	"When my body ‘shouts’ STOP, my mind ‘screams’ NEVER.",
	"If you always do what you have always done, you will always get what you have always got.",
	"The best way to predict your future is to create it.",
	"You don’t drown by falling in the water; you drown by staying there.",
	"There are so many people out there who will tell you that you can’t. What you’ve got to do is to turn around and say – watch me.",
	"The more you train, the more people there are who are weaker than you",
	"When you’re not training, someone else is .",
	"Men shouldn’t hide weakness, they should kill it .",
	"The pain of today is the victory of tomorrow .",
	"If your out of breath, dizzy, feel like vomiting, can’t remember your name, you are on the right road .",
	"Of course its heavy, thats why they call it weight.",
	"Crawling is acceptable. Falling is acceptable. Puking is acceptable. Tears are acceptable. Pain is acceptable. Injury is acceptable. Quitting is unacceptable",
	"Squat! Because somewhere there’s a girl warming up with your max.",
	"Cheat on your girlfriends, not on your workouts.",
	"A pint of sweat will save a gallon of blood.",
	"Second place is just a spot for the first looser .",
	"Just think about how you wanna look, just think about how you wanna look. Ok, up with it!"
];

var qotd_inspiring_text = [
	"Strive for progress, not perfection. -Unknown",
	"You miss 100% of the shots you don’t take. -Wayne Gretzky",
	"Nothing great was ever achieved without enthusiasm. -Ralph Waldo Emerson",
	"Motivation is what gets you started. Habit is what keeps you going. -Jim Ryan",
	"Strength does not come from physical capacity. It comes from an indomitable will. -Mahatma Gandhi",
	"If you don’t make mistakes, you aren’t really trying. -Unknown",
	"The difference between a goal and a dream is a deadline. -Steve Smith",
	"It’s not who you are that holds you back, it’s who you think you’re not. -Anonymous",
	"The finish line is just the beginning of a whole new race. -Unknown",
	"Insanity: doing the same thing over and over again and expecting different results. -Albert Einstein",
	"Time and health are two precious assets that we don’t recognize and appreciate until they have been depleted. -Denis Waitley"
];

function qotd_rich()
{
	var s = qotd_inspiring_text[Math.floor(Math.random()*qotd_inspiring_text.length)];
	return s.replace(/-.[A-Za-z ]*$/g, function(str, $1) { return "<br/><i style='padding-left:15px'>"+str+"</i>"; });
}
