var fs=require('fs');

function timestampToFrame(timestamp) {
  return 120 * parseInt(timestamp.substr(0,2), 10) + 2 * parseInt(timestamp.substr(2,2), 10);
}

timestamps = fs.readFileSync('timestamps', 'utf-8').toString().split('\n');

var timeOffset = 0;

var events = timestamps.map(function(item) {
  var event = {
    time: item.substr(0, 4)
  };

  var what = item.substr(5).trim();

  if(what == 'start') {
    event.type = 'start';
    timeOffset = timestampToFrame(item);
  } else
  if(what == 'end') {
    event.type = 'end';
  } else
  if(what == 'crash') {
    event.type = 'crash';
  } else {
    event.type = 'change';
    event.people = parseInt(item.substr(5), 10);
    event.frame = timestampToFrame(item) - timeOffset;
  }

  return event;
});

var changeEvents = events.filter(function(event) {
  return event.type == 'change';
});

var ranges = [];

for(var i=0; i<changeEvents.length - 1; i++) {
  if(changeEvents[i].people > 1) {
    ranges.push({from: changeEvents[i].frame, to: changeEvents[i+1].frame, people: changeEvents[i].people});
  }
}

console.log(ranges);


//console.log(timestamps);
