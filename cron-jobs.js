const cluster = require('cluster');

function create_cron_tasks() {
    tasks = []
    for (let i = 1; i < 11; i++) {
        tasks.push({
            name: `Task_${cluster.worker.id}_${i}`,
            interval: `*/${i * 1.5} * * * * *`
        })
    }
    return tasks
}



print()