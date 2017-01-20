/* global Module */

/* Magic Mirror
 * Module: MMM-NBARanking
 *
 * By Julien Stroheker
 * MIT Licensed.
 */

Module.register('MMM-NBARanking', {

    defaults: {
        myTeam: 'Spurs',
        interval: 5000, //all modules use milliseconds
    },

    start: function() {
        Log.info('Starting module: ' + this.name);
        if (this.data.classes === 'MMM-NBARanking') {
          this.data.classes = 'bright medium';
        }
        this.loaded = false;
        this.standing = [];
        this.updateRank(this);
    },

    updateRank: function(self) {
        self.sendSocketNotification('NBA_RANK', {'myTeam':self.config.myTeam});
        setTimeout(self.updateRank, self.config.interval, self);
    },

    getStyles: function() {
        return ['nba.css', 'font-awesome.css'];
    },

    getDom: function() {

        var wrapper = document.createElement("table");
        wrapper.className = "small";
        if (!this.loaded) 
        {
            wrapper.innerHTML = 'Loading NBA Ranking...';
            wrapper.className = "small dimmed";
            return wrapper;
        }
        var eventWrapperT = document.createElement("tr");
        eventWrapperT.className = "normal";
        
        var infoId = document.createElement("td");
        infoId.innerHTML = "";
        eventWrapperT.appendChild(infoId);

        var infoLogo = document.createElement("td");
        infoLogo.innerHTML = "";
        eventWrapperT.appendChild(infoLogo);

        var infoTeamName = document.createElement("td");
        infoTeamName.innerHTML = "";
        eventWrapperT.appendChild(infoTeamName);
        
        var infoWin = document.createElement("td");
        infoWin.className = "NBAinfoloss";
        infoWin.innerHTML = "W";
        eventWrapperT.appendChild(infoWin);

        var infoLoss = document.createElement("td");
        infoLoss.className = "NBAinfoloss";
        infoLoss.innerHTML = "L";
        eventWrapperT.appendChild(infoLoss);

        wrapper.appendChild(eventWrapperT);

        var rank = 1;
        
        this.standing.forEach(function(result) {
            var eventWrapper = document.createElement("tr");
            eventWrapper.className = "normal";

            var numberWrapper = document.createElement("td");
            numberWrapper.innerHTML = rank;
            eventWrapper.appendChild(numberWrapper);
            rank++;

            var logoWrapper = document.createElement("td");
            
            logoWrapper.innerHTML = "<img src=\"http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/"+result.teamLogo+".svg\" height=\"30\" width=\"30\">";
            eventWrapper.appendChild(logoWrapper);

            var teamWrapper = document.createElement("td");
            teamWrapper.className = "NBAteamName";
            teamWrapper.innerHTML = result.teamName;
            eventWrapper.appendChild(teamWrapper);

            var winWrapper = document.createElement("td");
            winWrapper.className = "NBAinfoloss";
            winWrapper.innerHTML = result.win;
            eventWrapper.appendChild(winWrapper);

            var lossWrapper = document.createElement("td");
            lossWrapper.className = "NBAinfoloss";
            lossWrapper.innerHTML = result.loss;
            eventWrapper.appendChild(lossWrapper);

            wrapper.appendChild(eventWrapper);

        });

        return wrapper;

        /*
      this.thermostats.forEach(function(element) {
        var eventWrapper = document.createElement("tr");
        eventWrapper.className = "normal";

        var activeWrapper = document.createElement("td");
        activeWrapper.className = "symbol";
        var symbolActive = document.createElement("span");
        if (element.active === 1){symbolActive.className = 'fa fa-bolt';}
        else {symbolActive.className = '';}
        activeWrapper.appendChild(symbolActive);
        eventWrapper.appendChild(activeWrapper);

        var symbolWrapper = document.createElement("td");
        symbolWrapper.className = "symbol";
				var symbol = document.createElement("span");
        if (element.name === "Salon"){symbol.className = 'fa fa-television';}
        else if (element.name === "Bureau"){symbol.className = 'fa fa-briefcase';}
        else if (element.name === "Chambre" || element.name === "Chambre Guest"){symbol.className = 'fa fa-bed';}
        else {symbol.className = 'fa fa-home';}
        symbolWrapper.appendChild(symbol);
				eventWrapper.appendChild(symbolWrapper);

        

        var titleWrapper = document.createElement("td");
        titleWrapper.innerHTML = element.name + ' : ' + element.temperature + '°C';
        titleWrapper.className = "titleNevi bright";
        eventWrapper.appendChild(titleWrapper);

        wrapper.appendChild(eventWrapper);

      });

      return wrapper;
*/
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'NBA_NEWRANK') {
            Log.info('received NBA_NEWRANK');
            this.standing = payload;
            this.loaded = true;
            this.updateDom(1000);
        }
    }

});
