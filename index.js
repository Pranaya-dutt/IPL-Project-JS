let csvToJson = require('convert-csv-to-json');

let matchesPath = 'Resources/matches.csv'; 
let deliveryPath = 'Resources/deliveries.csv';


let jsonMatches = csvToJson.fieldDelimiter(',').getJsonFromCsv(matchesPath);

let jsonDeliveries = csvToJson.fieldDelimiter(',').getJsonFromCsv(deliveryPath);


findNumberOfMatchesPlayedPerYearOfAllYears(jsonMatches);
findNumberOfMatchesWonPerTeamInAllSeasons(jsonMatches);
findExtraRunsConcededPerTeamIn2016(jsonMatches, jsonDeliveries);
findMostEconomicalBowlerIn2015(jsonMatches, jsonDeliveries);
findNumberOfTossWonByEachTeam(jsonMatches);

function findNumberOfMatchesPlayedPerYearOfAllYears(jsonMatches){
    let matchesPerYear = {};

    for(let i = 0; i<jsonMatches.length; i++){
        if(matchesPerYear[jsonMatches[i].season]){
            matchesPerYear[jsonMatches[i].season]++;
        } else{
            matchesPerYear[jsonMatches[i].season] = 1;
        }
    }
    console.log("Matches played per year");
    console.log();
    console.log(matchesPerYear);
    console.log("-------------------------");
}

function findNumberOfMatchesWonPerTeamInAllSeasons(jsonMatches){
    let wonMatches = {};

    for(let i = 0; i<jsonMatches.length; i++){
        if(jsonMatches[i].result == "normal"){
            if(wonMatches[jsonMatches[i].winner]){
                wonMatches[jsonMatches[i].winner]++;
            } else {
                wonMatches[jsonMatches[i].winner] = 1;
            }
        }
    }
    console.log();
    console.log("Number of Matches won by every team");
    console.log();
    console.log(wonMatches);
    console.log("-------------------------");
}

function findExtraRunsConcededPerTeamIn2016(jsonMatches, jsonDeliveries){
    let extraRuns = {};

    for(let i = 0; i<jsonMatches.length; i++){
        if(jsonMatches[i].season == 2016){
            for(let j = 0; j<jsonDeliveries.length; j++){
                if(jsonDeliveries[j].match_id == jsonMatches[i].id){
                    if(extraRuns[jsonDeliveries[j].bowling_team]){
                        let runs = extraRuns[jsonDeliveries[j].bowling_team];
                        runs = runs + parseInt(jsonDeliveries[j].extra_runs);
                        extraRuns[jsonDeliveries[j].bowling_team] = runs;
                    } else{
                        let exrun = parseInt(jsonDeliveries[j].extra_runs);
                        extraRuns[jsonDeliveries[j].bowling_team] = exrun;
                    }
                }
            }
        }
    }
    console.log();
    console.log("Extra runs conceded per team in 2016");
    console.log();
    console.log(extraRuns);
    console.log("-------------------------");
}

function findMostEconomicalBowlerIn2015(jsonMatches,jsonDeliveries){
    let runsPerBowler = {};
    let overPerBowler = {};
    let economyRatePerBowler = {};

    for(let i = 0; i<jsonMatches.length; i++){
        if(jsonMatches[i].season == 2015){
            for(let j = 0; j<jsonDeliveries.length; j++){
                if(jsonDeliveries[j].match_id == jsonMatches[i].id){
                    if(runsPerBowler[jsonDeliveries[j].bowler]){
                        let runs = runsPerBowler[jsonDeliveries[j].bowler];
                        runs = runs + parseInt(jsonDeliveries[j].total_runs);
                        runsPerBowler[jsonDeliveries[j].bowler] = runs;
                    } else {
                        runsPerBowler[jsonDeliveries[j].bowler] = parseInt(jsonDeliveries[j].total_runs);
                    }

                    if(overPerBowler[jsonDeliveries[j].bowler]){
                        let balls = overPerBowler[jsonDeliveries[j].bowler];
                        balls = balls + 1.0;
                        overPerBowler[jsonDeliveries[j].bowler] = balls;
                    } else {
                        overPerBowler[jsonDeliveries[j].bowler] = 1.0;
                    }
                }
            }
        }
    }

    for(let bowler of Object.keys(overPerBowler)) {
        overPerBowler[bowler] /= 6.0;
    }

    for(let i = 0; i<jsonMatches.length; i++){
        if(jsonMatches[i].season == 2015){
            for(let j = 0; j<jsonDeliveries.length; j++){
                if(jsonDeliveries[j].match_id == jsonMatches[i].id){
                    if(!economyRatePerBowler[jsonDeliveries[j].bowler]){
                        let economyRate = runsPerBowler[jsonDeliveries[j].bowler] / overPerBowler[jsonDeliveries[j].bowler];
                        economyRatePerBowler[jsonDeliveries[j].bowler] = economyRate;
                    }
                }
            }
        }
    }

    let sortedRate = [];
    for(let bowler of Object.keys(economyRatePerBowler)){
        sortedRate.push([bowler, economyRatePerBowler[bowler]]);
    }

    sortedRate.sort(function(a, b) {
        return a[1] - b[1];
    });
    console.log();
    console.log("Most economical bowler of 2015 IPL is :");
    console.log();
    console.log(sortedRate[0]);
    console.log("-------------------------");
}

function findNumberOfTossWonByEachTeam(jsonMatches){
    let wonTossPerTeam = {};

    for(let i = 0; i<jsonMatches.length; i++){
        if(wonTossPerTeam[jsonMatches[i].toss_winner]){
            wonTossPerTeam[jsonMatches[i].toss_winner]++;
        } else {
            wonTossPerTeam[jsonMatches[i].toss_winner] = 1;
        }
    }
    console.log();
    console.log("Number of times toss won by each team");
    console.log();
    console.log(wonTossPerTeam);
}
