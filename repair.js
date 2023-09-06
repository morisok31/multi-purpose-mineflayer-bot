console.log("Starting libraries...")
const mineflayer = require('mineflayer')
const bossName = "Makkusu_Otaku"; //Your name here.... unless?
const prefix = "Bodyguard";
const { GoalBlock } = require('mineflayer-pathfinder').goals
const { GoalXZ } = require('mineflayer-pathfinder').goals
const { GoalNear } = require('mineflayer-pathfinder').goals
const { GoalFollow } = require('mineflayer-pathfinder').goals
const { GoalBreakBlock } = require('mineflayer-pathfinder').goals
const { pathfinder, Movements, Goals } = require('mineflayer-pathfinder')
var radarPlugin = require('mineflayer-radar')(mineflayer);
const { startSpectatorServer } = require('mineflayer-spectator')
console.log("Done!")

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node index.js <host> <port> [<name>] <version> [<password>]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'chatterbox',
  version: process.argv[5],
  password: process.argv[6]
})

// radar plugin options

var options = {
  host: 'localhost', // optional
  port: 5555,         // optional
}

// implement radar plugin

radarPlugin(bot, options);

startSpectatorServer(bot, { port: 47787 })

// repair module go brrr

//Log errors and kick messages
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn));
bot.on('error', err => console.log(err));

//Do this every time the bot moves
bot.on('move', ()=>{
    let boss = bot.players[bossName];
    //Abort if the boss is not on the server
    if (!boss) return;
    boss = boss.entity;
    //Abort if the boss is not close
    if (!boss) return;

    offset = boss.yaw;
    //Location is where the bot is supposed to be headed
    let location;
    
    if (target) {
        //If there is a target (enemy) to attack, make them the target location
        location = target.position;
    } else {
        //If there is no enemy (no combat), return to or keep staying with boss
        let x = Math.sin(bot.direction+offset)*personalSpace;
        let z = Math.cos(bot.direction+offset)*personalSpace;
        //Set the headed location to your position next to boss
        location = boss.position.offset(x, 0, z);
    }
    //Face the location it is heading
    bot.lookAt(location);
    //If in combat, hit the enemy
    if (target) bot.attack(target);
    //If it is not yet the amount of blocks "personalSpace" away from the location, walk
    if (bot.entity.position.xzDistanceTo(location) > personalSpace) {
        //Sprint forward
        bot.setControlState('forward', true);
        bot.setControlState('sprint', true);
        //Jump in case it is stuck
        bot.setControlState('jump', bot.entity.isCollidedHorizontally);
    }
});
return(bot);

function mainChat(username, message) {
//Ignore messages that are not from the boss
if (username != bossName) return;
//Boss's command parts as an array, e.g. ["kill, "jeb_"]
let tokens = message.split(' ');

switch(tokens[0]) {
    case 'kill':
        bots[0].chat("Received.");
        //Set the target to the nearest entity that has the username by what the boss said
        target = bots[0].nearestEntity((entity)=>{
            return(entity.displayName == tokens[1] || entity.username == tokens[1]);
        });
        console.log(target);
        break;
    case 'house':
        bots[0].chat("That was a different bot.");
        break;
}
}

function populate() {
//Spawn 1 Guard
bots.push(createBot());
if (bots.length < botCount) {
    //Wait 10 seconds before doing this once again (10 seconds between each Guard spawn)
    setTimeout(populate, 10000);
} else {
    //Do this when all bots are spawned
    console.log("Ready!");
    bots[0].on('chat', mainChat);
    //When an entity disappears (quits, dies etc.), and it's the target, remove the target
    bots[0].on('entityGone', (entity)=>{
        if (entity != target) return;
        target = 0;
    });
    //When an entity gets harmed
    bots[0].on('entityHurt', (entity)=>{
        //Ignore if the harmed entity is not the boss
        if (entity.username != bossName) return;

        let entities = [];

        for (const id of Object.keys(bots[0].entities)) {
            const entity = bots[0].entities[id];
            if (entity.username != bossName && !(entity.username || '').startsWith(prefix) && entity.type === 'mob') {
                entities.push(entity);
            }
        }

        entities = entities.sort((a, b)=>{
            //Sort by lowest distance to the boss
            return (a.position.xzDistanceTo(entity.position) - b.position.xzDistanceTo(entity.position));
        }).filter((entity)=>{
            if (entity) return entity;
        });

        //Select the entity that hurt the boss, by selecting the nearest entity that is not the boss or another Guard
        //This needs work :/
        if (entities[0]) target = entities[0];
    });
}
}

//Begin the Guard populating!
populate();