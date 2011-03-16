GEOSERVER.cql = (function(){
	
	var CQLParser = function(query, params) {
		params = COG.extend({
			maxPoints : 50
		}, params);
				
		var pointsToProcess;
		
		function checkType(type, coords) {
		// perform some basic checks on the data			
			if ((type === "LINESTRING") && (pointsToProcess === undefined)) {
				pointsToProcess = coords.length;
			}// if
		} // checkType
		
		// Adds commas to the linestring except the last point
		function pointCalc(coords, type) {
			var coordSlice = null,
			 	typeHandlers = {
					LINESTRING : function() {
						var firstElem = coords.length - pointsToProcess,
							lastElem = Math.min(firstElem + params.maxPoints, coords.length) - 1;

						// decrement the points to process by the last elem
						pointsToProcess = coords.length - lastElem;

						// if the points to process is 1 (due to the last element being one less)
						// then set to 0, note that the crossover caused by this calculation
						// is desired given we are subdividing linestrings
						if (pointsToProcess == 1) {
							pointsToProcess = 0;
						} // if

						// return the coordinates for the slice
						return coords.slice(firstElem, lastElem + 1).join(",");
					},
					POINT : function() {
						return coords;
					}
				}; // typeHandlers
			
			// execute the correct handler for the point type
			if (typeHandlers[type]) {
				coordSlice = typeHandlers[type]();
			} // if
			
			return coordSlice;
		
		} // pointCalc

		function bbox(args) {
			args = COG.extend({
				property: 'the_geom',
				min: '-90 -180',
				max: '90 180'
			}, args);

			var min = T5.Geo.Position.parse(args.min),
				max = T5.Geo.Position.parse(args.max);

			return COG.formatStr('BBOX({0}, {1}, {2}, {3}, {4})',
				args.property,
				min.lat,
				min.lon,
				max.lat,
				max.lon);
		} // bbox

		function contains(args) {
			args = COG.extend({
				property: 'the_geom',
				type: 'POINT'
			}, args);

			// check that the type is ok
			checkType(args.type, args.coords);

			return COG.formatStr('CONTAINS({0}, {1}({2}))',
				args.property,
				args.type,
				pointCalc(args.coords, args.type));
		} // contains

		function distance(args) {
			args = COG.extend({
				property: 'the_geom',
				type: 'POINT',
				distance: '.05',
				unit: 'kilometers'
			}, args);
			
			// check that the type is ok
			checkType(args.type, args.coords);

			return COG.formatStr('DWITHIN({0}, {1}({2}), {3}, {4})',
				args.property,
				args.type,
				pointCalc(args.coords, args.type),
				args.distance,
				args.unit);
		} // distance

		function like(args) {
			args = COG.extend({
				property: 'Name'
			}, args);

			return COG.formatStr("{0} LIKE '%{1}%'",
				args.property,
				args.value);
		} // like

		function cql(args) {
			args = COG.extend({
				operator: 'AND',
				conditions: []
			}, args);

			var queryElems = [];

			for (var ii = 0; ii < args.conditions.length; ii++) {
				var condition = args.conditions[ii],
					handler = null;

				if (condition.type) {
					handler = queryHandlers[condition.type];
				} // if

				// if we have a hander then execute it
				if (handler) {
					queryElems.push(handler(condition.args));
				} // if
			} // for

			return '(' + queryElems.join(' ' + args.operator + ' ') + ')';
		} // cql

		/* internals */
		var queryHandlers = {
			'spatial.bbox': bbox,
			'spatial.contains' : contains,
			'spatial.distance' : distance,
			like  : like,
			cql: cql
		};
		
		var cqlStrings = [cql(query)];
		
		while (pointsToProcess > 0) {
			cqlStrings.push(cql(query));
		} // while
		
		return cqlStrings;
	}; // CQLParser
	
	function parseCQL(query, params) {
		return CQLParser(query, params);
	} // parseCQL
	
	var module = {
		parseCQL: parseCQL
	};
	
	return module;
	
})();