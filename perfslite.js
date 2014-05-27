(function() {
  'use strict';

  window.PerfsLite = new (function PerfsLite() {

    var _this = this,
        _instances = {};

    function _now() {
      return Date.now();
    }

    function PerfInstance(instanceName) {
      var _thisInstance = this,
          _stackLogs = [];

      this.name = instanceName;
      this.start = _now();
      this.logs = {};

      this.statsLog = function(logName) {
        if(_thisInstance.logs[logName]) {
          var stats = {
            totalTime: 0,
            averageTime: 0,
            count: 0
          };

          for(var i = 0, len = _thisInstance.logs[logName].length; i < len; i++) {
            var log = _thisInstance.logs[logName][i];
            stats.totalTime += log.totalTime || 0;
            stats.count++;
          }

          stats.averageTime = stats.totalTime / stats.count;

          return stats;
        }

        return false;
      };

      this.allStatsLogs = function() {
        var logName,
            stats = [];

        for(logName in _thisInstance.logs) {
          stats.push({
            name: logName,
            stats: _thisInstance.statsLog(logName)
          });
        }

        return stats;
      };

      this.addStack = function(log) {
        _stackLogs.push({
          startTime: log.start - _thisInstance.start,
          endTime: _now() - _thisInstance.start,
          log: log
        });
      };

      this.stackLogs = function() {
        return $.extend([], _stackLogs).sort(function(a, b) {
          return a.log.start - b.log.start;
        });
      };

      this.BiggerLogNameLength = function() {
        var logName,
            length = 0;

        for(logName in _thisInstance.logs) {
          length = logName.length > length ? logName.length : length;
        }

        return length;
      };
    }

    function Log(instanceName, logName) {
      var _thisLog = this;

      this.instanceName = instanceName;
      this.name = logName;
      this.start = _now();

      this.stop = function() {
        _thisLog.totalTime = _now() - _thisLog.start;
        if(_instances[instanceName]) {
          _instances[instanceName].addStack(_thisLog);
        }
      };
    }

    function _formatTime(time) {
      return (time / 1000) + ' sec';
    }

    function _objectSize(obj) {
      var size = 0, key;
      for(key in obj) {
        if(obj.hasOwnProperty(key)) {
          size++;
        }
      }
      return size;
    }

    function _formatTextColumns(columns) {
      var text = [];

      for(var i = 0, len = columns.length; i < len; i++) {
        var col = columns[i];
        while(col.text.length < col.max || 0) {
          col.text += ' ';
        }
        text.push(col.text);
      }

      return text.join('');
    }

    this.instance = function(instanceName) {
      return _instances[instanceName] || false;
    };

    this.start = function(instanceName) {
      _instances[instanceName] = new PerfInstance(instanceName);
    };

    this.log = function(instanceName, logName) {
      var log = new Log(instanceName, logName);

      if(_instances[instanceName]) {
        var instance = _instances[instanceName];

        if(!instance.logs[logName]) {
          instance.logs[logName] = [];
        }
        instance.logs[logName].push(log);
      }

      return log;
    };

    this.lastLog = function(instanceName, logName) {
      if(_instances[instanceName]) {
        var instance = _instances[instanceName];
        if(instance.logs[logName]) {
          var logs = instance.logs[logName];
          if(logs) {
            return logs[logs.length - 1];
          }
        }
      }

      return _this.log('', logName);
    };

    this.result = function(instanceName) {

      if(!instanceName) {
        return;
      }

      if(!_instances[instanceName]) {
        return;
      }

      var instance = _instances[instanceName],
          totalTime = _formatTime(_now() - instance.start),
          info = ['======= PERFS: ' + instanceName + ' =======', ''];

      if(_objectSize(instance.logs) < 1) {
        info.push('(no log)');
      }
      else {

        var nameLen = instance.BiggerLogNameLength();

        info.push('*** TIMES ***');
        info.push('');

        var allStatsLogs = instance.allStatsLogs().sort(function(a, b) {
          return b.stats.averageTime - a.stats.averageTime;
        });

        for(var i = 0, len = allStatsLogs.length; i < len; i++) {
          var log = allStatsLogs[i];
          info.push(_formatTextColumns([{
            max: nameLen + 5,
            text: '> ' + log.name
          }, {
            text: '(calls: ' + log.stats.count + ', average: ' + _formatTime(log.stats.averageTime) + ', total: ' + _formatTime(log.stats.totalTime) + ')'
          }]));
        }

        info.push('');
        info.push('*** STACK ***');
        info.push('');

        var stack = instance.stackLogs();
        for(var i = 0, len = stack.length; i < len; i++) {
          var log = stack[i].log;
          info.push(_formatTextColumns([{
            max: nameLen + 5,
            text: '> ' + log.name
          }, {
            text: '(start: ' + _formatTime(stack[i].startTime)  + ', time: ' + _formatTime(log.totalTime) + ')'
          }]));
        }

      }

      info.push('');
      info.push('*** TOTAL ***');
      info.push('');
      info.push(totalTime);

      info.push('');
      console.info(info.join('\n'));

    };

  })();

})();