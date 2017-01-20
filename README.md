# MMM-NBARanking
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop). 
It can display the NBA Team Ranks

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/julienstroheker/MMM-NBARanking.git`. A new folder will appear, navigate into it.
2. Execute `npm install` to install the node dependencies.

## Config
The entry in `config.js` can include the following options:


|Option|Description|
|---|---|


Here is an example of an entry in `config.js`
```
{
	module: 'MMM-NBARanking',
	position: 'top_left',
    header: 'NBA'
	config: {

				}
		},
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [kshvmdn for his library and documentation on how we can use the stats and data API]https://github.com/kshvmdn/nba.js
