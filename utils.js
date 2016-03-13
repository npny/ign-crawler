function singleLineLog(string) {
	process.stdout.clearLine();
  	process.stdout.cursorTo(0);
  	process.stdout.write(string);
}


const Scheduler = {
	tasks: [],
	tasksRunning: 0,
	tasksCompleted: 0,
	interval: 2000,

	addTask: task => Scheduler.tasks.push(task),

	taskCompleted: () => {
		Scheduler.tasksCompleted++;
		Scheduler.tasksRunning--;
		Scheduler.progress()
	},

	nextTask: () => {
		if(!Scheduler.tasks.length) return;

		const task = Scheduler.tasks.pop();
		task();
		Scheduler.tasksRunning++;
		Scheduler.progress();
		setTimeout(Scheduler.nextTask, Scheduler.interval);
	},
	
	progress: (tasksLeft, tasksDone) => {
		singleLineLog(
			Scheduler.tasks.length + " tasks left | " +
			Scheduler.tasksRunning + " tasks running | " +
			Scheduler.tasksCompleted + " tasks completed"
		);
	}
}

module.exports = {
	singleLineLog,
	Scheduler
}