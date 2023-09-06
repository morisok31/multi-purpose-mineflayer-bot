console.log("Starting libraries...")
const mineflayer = require('mineflayer')
const { pathfinder, Movements, Goals } = require('mineflayer-pathfinder')
const { Vec3 } = require('vec3')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { GoalBlock, GoalXZ, GoalNear, GoalFollow, GoalBreakBlock } = require('mineflayer-pathfinder').goals
const pvp = require('mineflayer-pvp').plugin
const { autototem } = require('mineflayer-auto-totem')
const inventoryViewer = require('mineflayer-web-inventory')
const armorManager = require("mineflayer-armor-manager");
const toolPlugin = require('mineflayer-tool').plugin
const { startSpectatorServer } = require('mineflayer-spectator')
var radarPlugin = require('mineflayer-radar')(mineflayer);
var tpsPlugin = require('mineflayer-tps')(mineflayer)
const minecraftData = require('minecraft-data')
const mcData = minecraftData('1.20.1')
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
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
  port: 1234, // optional
}

// implement radar plugin

radarPlugin(bot, options);

startSpectatorServer(bot, { port: 25565 })

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3001 }) // Start the viewing server on port 3001

  // Draw the path followed by the bot
  const path = [bot.entity.position.clone()]
  bot.on('move', () => {
    if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
      path.push(bot.entity.position.clone())
      bot.viewer.drawLine('path', path)
    }
  })
})

bot.on('chat', (username, message) => {
  if (message === '!slot 1') {
    bot.setQuickBarSlot(1)
  }
  }
)

bot.on('chat', (username, message) => {
  if (message === '!slot 2') {
    bot.setQuickBarSlot(2)
  }
  }
)

bot.on('chat', (username, message) => {
  if (message === '!slot 3') {
    bot.setQuickBarSlot(3)
  }
  }
)

bot.on('chat', (username, message) => {
  if (message === '!slot 4') {
    bot.setQuickBarSlot(4)
  }
  }
)

bot.on('chat', (username, message) => {
  if (message === '!slot 5') {
    bot.setQuickBarSlot(5)
  }
  }
)

bot.on('chat', (username, message) => {
  if (message === '!slot 6') {
    bot.setQuickBarSlot(6)
  }
  }
)

bot.on('chat', (username, message) => {
  if (message === '!slot 7') {
    bot.setQuickBarSlot(7)
  }
  }
)

bot.on('chat', (username, message) => {
  if (message === '!slot 8') {
    bot.setQuickBarSlot(8)
  }
  }
)

// crashes your bot, trying to fix

/*
bot.on('chat', (username, message) => {
   if (message === '!slot 9') {
     bot.setQuickBarSlot(9)
  }
  }
 )
*/

bot.on('chat', (username, message) => {
  if (message === '!discord') {
    bot.chat('https:/discord.gg/D63HwWRU8Z')
  }
  }
)

bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
bot.loadPlugin(toolPlugin)
bot.loadPlugin(armorManager)
bot.loadPlugin(autototem)
bot.loadPlugin(tpsPlugin)

bot.once("spawn", () => bot.armorManager.equipAll());

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3002 })

  bot.on('path_update', (r) => {
    const nodesPerTick = (r.visitedNodes * 50 / r.time).toFixed(2)
    const path = [bot.entity.position.offset(0, 0.5, 0)]
    for (const node of r.path) {
      path.push({ x: node.x, y: node.y + 0.5, z: node.z })
    }
    bot.viewer.drawLine('path', path, 0xff00ff)
  })

  const mcData = require('minecraft-data')(bot.version)
  const defaultMove = new Movements(bot, mcData)

  bot.viewer.on('blockClicked', (block, face, button) => {
    if (button !== 2) return // only right click

    const p = block.position.offset(0, 1, 0)

    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z))
  })
})

bot.once('spawn', () => {
  // We create different movement generators for different type of activity
  const defaultMove = new Movements(bot)
  
  bot.on('goal_reached', (goal) => {
    console.log('Here I am !')
  })

  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    const target = bot.players[username] ? bot.players[username].entity : null
    if (message === '!come') {
      if (!target) {
        bot.chat('I don\'t see you !')
        return
      }
      const p = target.position

      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
    } else if (message.startsWith('!goto')) {
      const cmd = message.split(' ')

      if (cmd.length === 4) { // goto x y z
        const x = parseInt(cmd[1], 10)
        const y = parseInt(cmd[2], 10)
        const z = parseInt(cmd[3], 10)

        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalBlock(x, y, z))
      } else if (cmd.length === 3) { // goto x z
        const x = parseInt(cmd[1], 10)
        const z = parseInt(cmd[2], 10)

        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalXZ(x, z))
      } else if (cmd.length === 2) { // goto y
        const y = parseInt(cmd[1], 10)

        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalY(y))
      }
    } else if (message === '!follow') {
      // else if (message === '!follow', username) {
      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalFollow(target, 3), true)
      // bot.pathfinder.setGoal(new GoalFinder(target, username, 3), true)

      /*
    } else if (message === '!avoid') {
      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(target, 5)), true)
      */

    } else if (message === '!stop') {
      bot.pathfinder.stop()
    } else if (message === '!break') {
      if (!target) {
        bot.chat('I can\'t see you!')
        return
      }
      const p = target.position.offset(0, -1, 0)
      const goal = new GoalBreakBlock(p.x, p.y, p.z, bot)
      bot.pathfinder.goto(goal)
        .then(() => {
          bot.dig(bot.blockAt(p), 'raycast')
            .catch(err => console.error('digging error', err))
        }, (err) => {
          console.error('Pathfing error', err)
        })
    }
  })
})

bot.on('chat', (username, message) => {
  if (message === '!fight') {
    const player = bot.players[username]

    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.pvp.attack(player.entity)
  }

  if (message === 'stop') {
    bot.pvp.stop()
  }
})

bot.on('chat', (username, message) => {
  if (message === '!stop') {
    bot.pvp.stop()
  }
  }
)

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  const command = message.split(' ')
  switch (true) {
    case message === '!loaded':
      await bot.waitForChunksToLoad()
      bot.chat('Ready!')
      break
    case /^!list$/.test(message):
      sayItems()
      break
    case /^!toss \d+ \w+$/.test(message):
      // toss amount name
      // ex: toss 64 diamond
      tossItem(command[2], command[1])
      break
    case /^!toss \w+$/.test(message):
      // toss name
      // ex: toss diamond
      tossItem(command[1])
      break
    case /^!equip [\w-]+ \w+$/.test(message):
      // equip destination name
      // ex: equip hand diamond
      equipItem(command[2], command[1])
      break
    case /^!unequip \w+$/.test(message):
      // unequip testination
      // ex: unequip hand
      unequipItem(command[1])
      break
    case /^!use$/.test(message):
      useEquippedItem()
      break
    case /^!craft \d+ \w+$/.test(message):
      // craft amount item
      // ex: craft 64 stick
      craftItem(command[2], command[1])
      break
  }
})

function sayItems (items = null) {
  if (!items) {
    items = bot.inventory.items()
    if (bot.registry.isNewerOrEqualTo('1.20.1') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
  }
  const output = items.map(itemToString).join(', ')
  if (output) {
    bot.chat(output)
  } else {
    bot.chat('empty')
  }
}

async function tossItem (name, amount) {
  amount = parseInt(amount, 10)
  const item = itemByName(name)
  if (!item) {
    bot.chat(`I have no ${name}`)
  } else {
    try {
      if (amount) {
        await bot.toss(item.type, null, amount)
        bot.chat(`tossed ${amount} x ${name}`)
      } else {
        await bot.tossStack(item)
        bot.chat(`tossed ${name}`)
      }
    } catch (err) {
      bot.chat(`unable to toss: ${err.message}`)
    }
  }
}

async function equipItem (name, destination) {
  const item = itemByName(name)
  if (item) {
    try {
      await bot.equip(item, destination)
      bot.chat(`equipped ${name}`)
    } catch (err) {
      bot.chat(`cannot equip ${name}: ${err.message}`)
    }
  } else {
    bot.chat(`I have no ${name}`)
  }
}

async function unequipItem (destination) {
  try {
    await bot.unequip(destination)
    bot.chat('unequipped')
  } catch (err) {
    bot.chat(`cannot unequip: ${err.message}`)
  }
}

function useEquippedItem () {
  bot.chat('activating item')
  bot.activateItem()
}

async function craftItem (name, amount) {
  amount = parseInt(amount, 10)
  const item = bot.registry.itemsByName[name]
  const craftingTableID = bot.registry.blocksByName.crafting_table.id

  const craftingTable = bot.findBlock({
    matching: craftingTableID
  })

  if (item) {
    const recipe = bot.recipesFor(item.id, null, 1, craftingTable)[0]
    if (recipe) {
      bot.chat(`I can make ${name}`)
      try {
        await bot.craft(recipe, amount, craftingTable)
        bot.chat(`did the recipe for ${name} ${amount} times`)
      } catch (err) {
        bot.chat(`error making ${name}`)
      }
    } else {
      bot.chat(`I cannot make ${name}`)
    }
  } else {
    bot.chat(`unknown item: ${name}`)
  }
}

function itemToString (item) {
  if (item) {
    return `${item.name} x ${item.count}`
  } else {
    return '(nothing)'
  }
}

function itemByName (name) {
  const items = bot.inventory.items()
  if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
  return items.filter(item => item.name === name)[0]
}

// Listen for chat events
bot.on('chat', async (username, message) => {
  // Only listen for when someone says 'get tool'
  if (message !== '!tool') return

  // Get the player who said it
  const player = bot.players[username]

  // Print an error in chat if the bot can't see the player
  if (!player) {
    bot.chat("I can't see you!")
    return
  }

  // Get the block below the player
  const blockPos = player.entity.position.offset(0, -1, 0)
  const block = bot.blockAt(blockPos)

  // Let the player know it's working
  bot.chat(`Getting best tool for ${block.name}`)

  // Equip the best tool for mining that block
  bot.tool.equipForBlock(block)

  // You can also specify other options and use await
  /*
  const mcData = require('minecraft-data')(bot.version)
  bot.tool.chestLocations = bot.findBlocks({
    matching: mcData.blocksByName.chest.id,
    maxDistance: 16,
    count: 999
  })

  try {
    await bot.tool.equipForBlock(block, {
      requireHarvest: true,
      getFromChest: true
    })
    await bot.dig(block)
  } catch (err) {
    console.log(err)
  } */
})

bot.on('chat', async (username, message) => {
if (message === '!activate'){
  bot.activateItem()
}
})

bot.on("physicsTick", async () => {
  bot.autototem.equip()
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  if (message === '!tps') {
    bot.chat('Current tps: ' + bot.getTps())
  }
})

inventoryViewer(bot)

// Define the logChat function
function logChat(sender, message) {
  console.log(`[${sender}] ${message}`);
}

  bot.on('message', (jsonMsg, position, sender, senderUUID) => {
    const message = jsonMsg.toString().trim();
    let username = '';
  
    if (sender) {
      if (bot.players[sender]) {
        username = bot.players[sender].username;
      }
    } else if (senderUUID) {
      if (bot.players[senderUUID]) {
        username = bot.players[senderUUID].username;
      }
    }
  
    if (username) {
      logChat(username, message);
    } else {
      logChat('Server', message);
    }
  });
  

  function readBotConsoleInput() {
    rl.question('', (message) => {
      bot.chat(message);
      readBotConsoleInput(); // Listen for the next input
    });
  }
  
// Start listening for user input from the bot console
readBotConsoleInput();

/*
bot.on('nonSpokenChat', (message) => {
  console.log(`Non spoken chat: ${message}`)
})
*/

bot.on('spawnReset', (message) => {
  console.log('Oh noez! My bed is broken.')
})
bot.once('spawn', () => {
  console.log(`I have ${bot.health} health and ${bot.food} food`)
})
bot.on('death', () => {
  console.log('I died x.x')
})
bot.on('kicked', (reason) => {
  console.log(`I got kicked for ${reason}`)
})
bot.on('playerJoined', (player) => {
  if (player.username !== bot.username) {
    bot.chat(`Hello, ${player.username}! Welcome to the server.`)
  }
})