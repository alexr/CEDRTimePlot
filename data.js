var data = (function(f) {
  var raw = [
      { vs: '12:01', ve: '12:03', id: 1, license: 'JNB 7001', state: 'NY', make: 'Honda'    , model: 'CRV'    , vehicleType: 1, vehicleWeight:     0, toll:  7.0, tag: '123456789' },
      { vs: '12:02', ve: '12:03', id: 1, license: 'YXZ 1001', state: 'NY', make: 'Toyota'   , model: 'Camry'  , vehicleType: 1, vehicleWeight:     0, toll:  4.0, tag: '' },
      { vs: '12:02', ve: '12:04', id: 3, license: 'ABC 1004', state: 'CT', make: 'Ford'     , model: 'Taurus' , vehicleType: 1, vehicleWeight:     0, toll:  5.0, tag: '456789123' },
      { vs: '12:03', ve: '12:07', id: 2, license: 'XYZ 1003', state: 'CT', make: 'Toyota'   , model: 'Corolla', vehicleType: 1, vehicleWeight:     0, toll:  4.0, tag: '' },
      { vs: '12:03', ve: '12:08', id: 1, license: 'BNJ 1007', state: 'NY', make: 'Honda'    , model: 'CRV'    , vehicleType: 1, vehicleWeight:     0, toll:  5.0, tag: '789123456' },
      { vs: '12:05', ve: '12:07', id: 2, license: 'CDE 1007', state: 'NJ', make: 'Toyota'   , model: '4x4'    , vehicleType: 1, vehicleWeight:     0, toll:  6.0, tag: '321987654' },
      { vs: '12:06', ve: '12:09', id: 2, license: 'BAC 1005', state: 'NY', make: 'Toyota'   , model: 'Camry'  , vehicleType: 1, vehicleWeight:     0, toll:  5.5, tag: '567891234' },
      { vs: '12:07', ve: '12:10', id: 1, license: 'ZYX 1002', state: 'NY', make: 'Honda'    , model: 'Accord' , vehicleType: 1, vehicleWeight:     0, toll:  6.0, tag: '234567891' },
      { vs: '12:07', ve: '12:10', id: 2, license: 'ZXY 1001', state: 'PA', make: 'Toyota'   , model: 'Camry'  , vehicleType: 1, vehicleWeight:     0, toll:  4.0, tag: '987654321' },
      { vs: '12:08', ve: '12:10', id: 3, license: 'CBA 1008', state: 'PA', make: 'Ford'     , model: 'Mustang', vehicleType: 1, vehicleWeight:     0, toll:  4.5, tag: '891234567' },
      { vs: '12:09', ve: '12:11', id: 2, license: 'DCB 1004', state: 'NY', make: 'Volvo'    , model: 'S80'    , vehicleType: 1, vehicleWeight:     0, toll:  5.5, tag: '654321987' },
      { vs: '12:09', ve: '12:16', id: 2, license: 'CDB 1003', state: 'PA', make: 'Volvo'    , model: 'C30'    , vehicleType: 1, vehicleWeight:     0, toll:  5.0, tag: '765432198' },
      { vs: '12:09', ve: '12:10', id: 3, license: 'YZX 1009', state: 'NY', make: 'Volvo'    , model: 'V70'    , vehicleType: 1, vehicleWeight:     0, toll:  4.5, tag: '912345678' },
      { vs: '12:10', ve: '12:12', id: 3, license: 'BCD 1002', state: 'NY', make: 'Toyota'   , model: 'Rav4'   , vehicleType: 1, vehicleWeight:     0, toll:  5.5, tag: '876543219' },
      { vs: '12:10', ve: '12:14', id: 1, license: 'CBD 1005', state: 'NY', make: 'Toyota'   , model: 'Camry'  , vehicleType: 1, vehicleWeight:     0, toll:  4.0, tag: '543219876' },
      { vs: '12:11', ve: '12:13', id: 1, license: 'NJB 1006', state: 'CT', make: 'Ford'     , model: 'Focus'  , vehicleType: 1, vehicleWeight:     0, toll:  4.5, tag: '678912345' },
      { vs: '12:12', ve: '12:15', id: 3, license: 'PAC 1209', state: 'NJ', make: 'Chevy'    , model: 'Malibu' , vehicleType: 1, vehicleWeight:     0, toll:  6.0, tag: '219876543' },
      { vs: '12:15', ve: '12:22', id: 2, license: 'BAC 1005', state: 'PA', make: 'Peterbilt', model: '389'    , vehicleType: 2, vehicleWeight: 2.675, toll: 15.5, tag: '567891234' },
      { vs: '12:15', ve: '12:18', id: 3, license: 'EDC 3109', state: 'NJ', make: 'Ford'     , model: 'Focus'  , vehicleType: 1, vehicleWeight:     0, toll:  4.0, tag: '198765432' },
      { vs: '12:18', ve: '12:20', id: 2, license: 'DEC 1008', state: 'NY', make: 'Toyota'   , model: 'Corolla', vehicleType: 1, vehicleWeight:     0, toll:  4.0, tag: '' },
      { vs: '12:20', ve: '12:22', id: 1, license: 'DBC 1006', state: 'NY', make: 'Honda'    , model: 'Civic'  , vehicleType: 1, vehicleWeight:     0, toll:  5.0, tag: '' },
      { vs: '12:20', ve: '12:23', id: 2, license: 'APC 2019', state: 'NJ', make: 'Honda'    , model: 'Civic'  , vehicleType: 1, vehicleWeight:     0, toll:  4.0, tag: '345678912' },
      { vs: '12:22', ve: '12:25', id: 1, license: 'EDC 1019', state: 'NJ', make: 'Honda'    , model: 'Accord' , vehicleType: 1, vehicleWeight:     0, toll:  4.0, tag: '432198765' }
  ];

  return function(selector) {
    if(typeof(selector) === 'function') {
      return raw.map(selector);
    } else {
      return raw;
    }
  };
}());

var sliding = function(events) {
  var prev = 0,
      cur,
      y = 1;
      result = [],
	    sync = events
        .map(function(d) { return d.vs })
        .concat(events
          .map(function(d) { return d.ve }))
	      .sort(function(a, b) { return a-b });

  for(var i = 0, imax = sync.length; i < imax; i += 1)
  {
    cur = sync[i];
    if(cur != prev) {
	    result.push(
        { kind: 'window', hExtend: 0, vs: prev, ve: cur, y: y,
          toString: function() { return 'vs: ' + this.vs + ', ve: ' + this.ve + ', d: ' + this.d; }
        });
	  prev = cur;
	  y = 3 - y;
	  }
  }
  
  return result;
};

var hopping = function(max, win, hop) {
  max = +max;
  win = +win;
  hop = +hop || +win;
  var result = [],
      vs,
	    ve,
	    y = 0,
	    loop = win <= hop ? 2 : Math.floor(win/hop) + 2;

  for(var i = -Math.max(win, hop); i <= max; i = i + hop) {
    vs = Math.max(0, i);
    ve = Math.min(max, i + win);
    if(ve > 0 && vs < max) {
      result.push(
        { kind: 'window', hExtend: 0, vs: vs, ve: ve, y: y % loop + 1,
          toString: function() { return 'vs: ' + this.vs + ', ve: ' + this.ve + ', y: ' + this.y; }
        });
	    y = y + 1;
    }
  }

  return result;
};

var rawEvents = data(function(d, i) {
  var ret = Object.create(d);
  ret.kind = 'event';
  ret.vs = +d.vs.split(':')[1];
  ret.ve = +d.ve.split(':')[1];
  ret.d = d.id;
  ret.title = "e" + (i+1);
  ret.extend = 0;
  ret.toString = function() { return 'vs: ' + this.vs + ', ve: ' + this.ve + ', d: ' + this.d + ', title: ' + this.title; };
	return ret;
});

var rawPoints = data(function(d, i) {
  var ret = Object.create(d);
  ret.kind = 'event';
  ret.vs = +d.vs.split(':')[1];
  ret.ve = +d.ve.split(':')[1];
  ret.d = d.id;
  ret.title = "e" + (i+1);
  ret.extend = 0;
  ret.toString = function() { return 'vs: ' + this.vs + ', ve: ' + this.ve + ', d: ' + this.d + ', title: ' + this.title; };
  return ret;
});
