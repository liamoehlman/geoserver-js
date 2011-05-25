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
			maxFeatures: 200,
			outputFormat: 'GML3',
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
				queryParams.push(COG.extend({}, requestParams));
				queryParams[0].filter = GEOSERVER.ogc.parseOGC(json);

				if (callback) {
					queryParams[0].format_options = "callback:GEOSERVER.callbacks." + createTempCallback(callback);
				} // if

				return queryParams;

			} else if (params.queryType === "cql") {

				if (params.maxPoints) {
					queries = GEOSERVER.cql.parseCQL(json, {maxPoints : params.maxPoints});
				} else {
					queries = GEOSERVER.cql.parseCQL(json);
				} // if ... else

				for (var ii=0; ii < queries.length; ii++) {
					queryParams.push(COG.extend({}, requestParams));
					queryParams[ii].cql_filter = queries[ii];

					if (callback) {
						queryParams[ii].format_options = "callback:GEOSERVER.callbacks." + createTempCallback(callback);
					} // if
				} // for

				return queryParams;

			} else {
				console.debug("Invalid query type");
			} // if...else
		} // if

		if (callback) {
			requestParams.format_options = "callback:GEOSERVER.callbacks." + createTempCallback(callback);
		}
		return requestParams;

	} // buildRequest

	var module = {
		buildRequest: buildRequest,
		callbacks: {}
	};

	return module;

})();
GEOSERVER.cql = (function(){
	var bboxFormatter = T5.formatter('BBOX({0}, {1}, {2}, {3}, {4})'),
		containsFormatter = T5.formatter('CONTAINS({0}, {1}({2}))'),
		distanceFormatter = T5.formatter('DWITHIN({0}, {1}({2}), {3}, {4})'),
		likeFormatter = T5.formatter("{0} LIKE '%{1}%'");

	var CQLParser = function(query, params) {
		params = T5.ex({
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
			args = T5.ex({
				property: 'the_geom',
				min: '-90 -180',
				max: '90 180'
			}, args);

			var min = new GeoJS.Pos(args.min),
				max = new GeoJS.Pos(args.max);

			return bboxFormatter(
				args.property,
				min.lat,
				min.lon,
				max.lat,
				max.lon);
		} // bbox

		function contains(args) {
			args = T5.ex({
				property: 'the_geom',
				type: 'POINT'
			}, args);

			checkType(args.type, args.coords);

			return containsFormatter(
				args.property,
				args.type,
				pointCalc(args.coords, args.type));
		} // contains

		function distance(args) {
			args = T5.ex({
				property: 'the_geom',
				type: 'POINT',
				distance: '.05',
				unit: 'kilometers'
			}, args);

			checkType(args.type, args.coords);

			return distanceFormatter(
				args.property,
				args.type,
				pointCalc(args.coords, args.type),
				args.distance,
				args.unit);
		} // distance

		function like(args) {
			args = T5.ex({
				property: 'Name'
			}, args);

			return likeFormatter(
				args.property,
				args.value);
		} // like

		function cql(args) {
			args = T5.ex({
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
			compound: cql
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

	function formatCoords(coords) {
		var regexp = /([\-,0-9,\.]+)\s([\-,0-9,\.]+)/;
		coords.forEach(function(value, index, array) {
			coords[index] = coords[index].replace(regexp, "$2,$1");
		});

		return coords;
	}

	var ogcParser = function(query, params) {
		params = T5.ex({
		}, params);

		function bbox(args) {
			args = T5.ex({
				property: 'the_geom',
				min: '-90 -180',
				max: '90 180',
				srs : 'EPSG:4326'
			}, args);

			var propertyName = '<ogc:PropertyName>'+args.property+'</ogc:PropertyName>',
				envelope = '<gml:Envelope srsName="'+args.srs+'"><gml:lowerCorner>'+args.min+'</gml:lowerCorner><gml:upperCorner>'+args.max+'</gml:upperCorner></gml:Envelope>',
				filter = '<ogc:BBOX>'+propertyName + envelope +'</ogc:BBOX>';

			return filter;
		}

		function dwithin(args) {
			args = T5.ex({
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
				pointCoords = '<gml:Point srsName="'+args.srs+'"><gml:coordinates>'+formatCoords(args.coords)+'</gml:coordindates></gml:point>';
			}
			else if (args.type === 'LINESTRING') {
				pointCoords = '<gml:LineString srsName="'+args.srs+'"><gml:coordinates>'+formatCoords(args.coords).join(' ')+'</gml:coordinates></gml:LineString>';
			} // if...elseif

			filter = '<ogc:DWithin>'+ propertyName + pointCoords + distance +'</ogc:DWithin>';

			return filter;
		} // dwithin

		function like(args) {
			args = T5.ex({
				property: null,
				value : null
			}, args);

			var propertyName = '<ogc:PropertyName>'+args.property+'</ogc:PropertyName>',
				searchName = '<ogc:Literal>*'+args.value+'*</ogc:Literal>',
				filter = '<ogc:PropertyIsLike wildCard="*" singleChar="?" escapeChar="\\">'+propertyName + searchName +'</ogc:PropertyIsLike>';

			return filter;
		} // like

		function ogc(args) {
			args = T5.ex({
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

			if (args.operator !== null) {
				return '<'+args.operator+'>' + queryElems.join('') + '</'+args.operator+'>';
			} else {
				return queryElems.join('');
			}
		} // ogc

		/* internals */

		var queryHandlers = {
			'spatial.distance' : dwithin,
			'spatial.bbox' : bbox,
			'like' : like,
			compound: ogc
		};

		var ogcFilter = ogc(query);

		return '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">'+ogcFilter+'</ogc:Filter>';

	}; // ogcParser

	function parseOGC(query) {
		return ogcParser(query);
	} // parseOGC

	var module = {
		parseOGC : parseOGC
	};

	return module;

})();
