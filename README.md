# Eco Exporter
Eco Exporter is used in the specific scenario where you would like to develop a world before releasing it to the public, normally you would have to deal with the downside of people thinking your server is X amount of days old when in reality you spent that time creating a fun and exciting world for them to play.
Players will normally want to join the newest servers so this can cause a problem.

### How it Works
This software is commandline based, you will need 2 things before you start, the world containing what you have developed (buildings, civics, etc) and a fresh untouched world (I reccomend regenerating the current world to avoid any unwanted issues but make sure you get a copy of the `Game.eco` file first)

The software will extract both `Game.eco` files and splice essential data from the source world to the fresh world.


# Usage
To start using this software, first open either CMD or Powershell within the directory you placed `Exporter.exe`

### Standard Example
`Exporter.exe src="Government.eco" dst="Fresh.eco"` - This will add Blocks, Plantes, Civics, and Objects from `Government.eco` to `Fresh.eco` and output `Game.eco` within the same folder.

If you want to set a custom output path you can use `out=C:/PATH/Game.eco` / `out=Game.eco`

If you want to only add specific attributes from the source world you can use `attr=blocks,plants` for example.
Attributes consist of `blocks`, `plants`, `civics`, and `objects` and should be seperated by commas and NO spaces.
