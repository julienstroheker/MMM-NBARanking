/* Magic Mirror
 * Module: MMM-NBARanking
 *
 * By Julien Stroheker
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var request = require('request');


module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-NBARanking helper started ...');
  },

//{'dataServer' 'email' 'password' 'gatewayname' 'room'});
  getRank: function() {
    var self = this;
    var uri = 'http://data.nba.net';
    var pathStandings = uri+'/data/10s/prod/v1/current/standings_all.json';
    var pathTeams = uri+'/data/10s/prod/v1/2016/teams.json';
    var results = [];
    function templateResult(){return{"teamId":"", "teamName":"", "teamLogo":"", "confName":"", "win":"", "loss":"", "winPct":"", "confRank":"", divRank:""};};


    request({url: pathTeams, method: 'GET'}, function(errorT, responseT, bodyT) {
    if (!errorT && responseT.statusCode == 200) 
    {
      if((JSON.parse(bodyT).league.standard)!=null)
      {
        var rawListTeams = JSON.parse(bodyT).league.standard;
        rawListTeams.forEach(function(team) {
          if(team.isNBAFranchise===true)
          {
            var t = templateResult();
            t.teamId = team.teamId;
            t.teamName = team.nickname;
            t.confName = team.confName;
            t.teamLogo = team.tricode;
            results.push(t);
          }
        }, this);

        request({url: pathStandings, method: 'GET'}, function(errorS, responseS, bodyS) {
          if (!errorS && responseS.statusCode == 200) {
            if((JSON.parse(bodyS).league.standard.teams)!=null) {
              var rawStandings = JSON.parse(bodyS).league.standard.teams;
              //console.log(rawStandings);
              for (var indexS = 0 ; indexS < rawStandings.length; indexS++) {
                //console.log("I am searching team with id : " + rawStandings[indexS].teamId);

                for (var indexT = 0 ; indexT < results.length; indexT++) 
                {
                  //console.log(results[indexT].teamId +' === '+ rawStandings[indexS].teamId);
                  if (results[indexT].teamId === rawStandings[indexS].teamId) 
                  {
                    results[indexT].win = rawStandings[indexS].win
                    results[indexT].loss = rawStandings[indexS].loss
                    results[indexT].confRank = rawStandings[indexS].confRank
                    results[indexT].divRank = rawStandings[indexS].divRank
                    results[indexT].winPct = rawStandings[indexS].winPct
                    //console.log("Row Updated for team "+ results[indexT].teamName + " / Win : " + results[indexT].win + " / Loss : " + results[indexT].loss + " / Div : " + results[indexT].divRank + " / Conf : " + results[indexT].confRank);
                  }
                }
              }

              results.sort(function (a, b) {
                return b.winPct - a.winPct;
              });
              /*
              var resultSorted = [];
              for (var indexC = 0; indexC < results.length; indexC++) {
                if (indexC === 0) 
                {
                  resultSorted.push(results[indexC]);
                }
                else
                {
                  if(results[indexC].winPct > results[indexC-1].winPct){
                    resultSorted.unshift(results[indexC]);
                  }
                  else
                  {
                    resultSorted.push(results[indexC]);
                  }
                }
              }
              */
              console.log(results);
              self.sendSocketNotification('NBA_NEWRANK', results)
            }
            else
            {
              console.log("Error parsing the JSON object for NBA Standings")
            }
          }
          else
          {
            console.log('Error with the request to get NBA Standings Object');
          }

        });
      }
      else
      {
        console.log("Error parsing the JSON object for NBA Teams")
      }
    }
    else
    {
      console.log('Error with the request to get NBA Teams Object');
    }
  });
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'NBA_RANK') {
      this.getRank();
    } 
  }
});