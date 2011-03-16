GEOSERVER = (function(){
	var callbackCounter = 1;

	function buildRequest(requestParams, params, json, callback)  {
		function createTempCallback() {
			var callbackId = 'cb_' + (callbackCounter++);

			module.callbacks[callbackId] = function(data) {
				callback(data);
				delete module.callbacks[callbackId];
			}; // temp callback

			return callbackId;
		} // createTempCallback

		requestParams = COG.extend({
			service: 'WFS',
			version: '1.1.0',
			request: 'GetFeature',
			maxFeatures: 20000,
			outputFormat: 'json',
			typeName : null
		}, requestParams);

		params = COG.extend({
			queryType: "ogc",
			maxPoints: undefined
		}, params);

		var queries = [],
			queryParams = [];

		/* extra params
			REQUIRED - typeName :
			OPTIONAL - propertyName :
		*/

		if (params.typeName === null) {
			console.debug("Dataset not specified");
		} // if

		if (json) {

			if (params.queryType === "ogc") {
				queryParams.push(COG.extend({}, params));
				queryParams.push.filter = GEOSERVER.ogc.parseOGC(json);

				if (callback) {
					queryParams[ii].format_options = "callback:GEOSERVER.callbacks." + createTempCallback(callback);
				} // if

			} else if (params.queryType === "cql") {

				if (maxPoints) {
					queries = GEOSERVER.cql.parseCQL(json, {maxPoints : maxPoints});
				} else {
					queries = GEOSERVER.cql.parseCQL(json);
				} // if ... else

				for (var ii=0; ii < queries.length; ii++) {
					queryParams.push(COG.extend({}, params));
					queryParams[ii].cql_filter = queries[ii];

					if (callback) {
						queryParams[ii].format_options = "callback:GEOSERVER.callbacks." + createTempCallback(callback);
					} // if
				} // for
			} else {
				console.debug("Invalid query type");
			} // if...else
		} // if

		return queryParams;

	} // buildRequest

	var module = {
		buildRequest: buildRequest,
		callbacks: {}
	};

	return module;

})();
GEOSERVER.cql = (function(){

	var CQLParser = function(query, params) {
		params = COG.extend({
			maxPoints : 50
		}, params);

		var pointsToProcess;

		function checkType(type, coords) {
			if ((type === "LINESTRING") && (pointsToProcess === undefined)) {
				pointsToProcess = coords.length;
			}// if
		} // checkType

		function pointCalc(coords, type) {
			var coordSlice = null,
			 	typeHandlers = {
					LINESTRING : function() {
						var firstElem = coords.length - pointsToProcess,
							lastElem = Math.min(firstElem + params.maxPoints, coords.length) - 1;

						pointsToProcess = coords.length - lastElem;

						if (pointsToProcess == 1) {
							pointsToProcess = 0;
						} // if

						return coords.slice(firstElem, lastElem + 1).join(",");
					},
					POINT : function() {
						return coords;
					}
				}; // typeHandlers

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
GEOSERVER.ogc = (function() {

	var ogcParser = function(query, params) {
		params = COG.extend({
		}, params);

		function dwithin(args) {
			args = COG.extend({
				property: 'the_geom',
				type: 'POINT',
				distance: '.05',
				unit: 'kilometers',
				srs : 'EPSG:4326',
				coords : null
			}, args);

			var	distance = '<ogc:Distance units="'+args.unit+'">'+args.distance+'</ogc:Distance>',
				propertyName = '<ogc:PropertyName>'+args.property+'</ogc:PropertyName>',
				pointCoords,
				filter;

			if (args.type === 'POINT') {
				pointCoords = '<gml:Point srsName="'+args.srs+'"><gml:coordinates>'+args.coords+'</gml:coordindates></gml:point>';
			}
			else if (args.type === 'LINESTRING') {
				pointCoords = '<gml:LineString '+args.srs+'><gml:coordinates>'+args.coords.join(' ')+'</gml:coordindates></gml:LineString>';
			} // if...elseif

			filter = '<ogc:DWithin>'+ propertyName + pointCoords + distance +'</ogc:DWithin>';

			return filter;
		} // dwithin

		function like(args) {
			args = COG.extend({
				property: null,
				value : null
			}, args);

			var propertyName = '<ogc:PropertyName>'+args.property+'</ogc:PropertyName>',
				searchName = '<ogc:Literal>*'+args.value+'*</ogc:Literal>',
				filter = '<ogc:PropertyIsLike wildCard="*" singleChar="?" escapeChar="\\">'+propertyName + searchName +'</ogc:PropertyIsLike>';

			return filter;
		} // like

		function ogc(args) {
			args = COG.extend({
				operator: null,
				conditions: []
			}, args);

			var queryElems = [];

			for (var ii = 0; ii < args.conditions.length; ii++) {
				var condition = args.conditions[ii],
					handler = null;

				if (condition.type) {
					handler = queryHandlers[condition.type];
				} // if

				if (handler) {
					queryElems.push(handler(condition.args));
				} // if
			} // for

			if (args.operator) {
				return '<'+args.operator+'>' + queryElems.join('') + '</'+args.operator+'>';
			} else {
				return queryElems.join("");
			}
		} // ogc

		/* internals */

		var queryHandlers = {
			'spatial.distance' : dwithin,
			'like' : like,
			ogc: ogc
		};

		var ogcFilter = ogc(query);

		return '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml>'+ogcFilter+'</ogc:Filter>';

	}; // ogcParser

	function parseOGC(query) {
		return ogcParser(query);
	} // parseOGC

	var module = {
		parseOGC : parseOGC
	};

	return module;

})();
