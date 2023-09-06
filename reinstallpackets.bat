@echo off
set NULL_VAL=null
set NODE_VER=%NULL_VAL%
set NODE_EXEC=node-v14.18.1-x86.msi

node -v >.tmp_nodever
set /p NODE_VER=<.tmp_nodever
del .tmp_nodever

IF "%NODE_VER%"=="%NULL_VAL%" (
	echo.
	echo Node.js is not installed! Please press a key to download and install it from the website that will open.
	PAUSE
	start "" http://nodejs.org/dist/v18.17.1/%NODE_EXEC%
	echo.
	echo.
	echo After you have installed Node.js, press a key to shut down this process. Please restart it again afterwards.
	PAUSE
	EXIT
) ELSE (
	echo A version of Node.js ^(%NODE_VER%^) is installed. Proceeding...
	npm install
    npm i mineflayer
    npm i mineflayer-afk-noblockbreak
    npm i mineflayer-armor-manager
    npm i mineflayer-auto-eat
    npm i mineflayer-auto-totem
    npm i mineflayer-pathfinder
    npm i mineflayer-pvp
    npm i mineflayer-radar
    npm i mineflayer-spectator
    npm i mineflayer-tool
    npm i mineflayer-tps
    npm i mineflayer-web-inventory
    npm i prismarine-viewer
    npm i openai
)