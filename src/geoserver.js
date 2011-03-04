GEOSERVER = (function(){
	
	function bbox(args) {
		args = COG.extend({
			property: 'TheGeom',
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
			property: 'TheGeom',
			type: 'POINT'
		}, args);
		
	//	var cqlQuery = "CONTAINS("+args.property+", "+args.type+"("+pointCalc(args.coords)+"))";
		return COG.formatStr('CONTAINS({0}, {1}({2}))',
			args.property,
			args.type,
			pointCalc(args.coords));
	} // contains
	
	function distance(args) {
		args = COG.extend({
			property: 'TheGeom',
			type: 'POINT',
			distance: '.05',
			unit: 'kilometers'
		}, args);
		
	//	var cqlQuery = "DWITHIN("+args.property+", "+args.type+"("+pointCalc(args.coords)+"), "+args.distance+", kilometers)";	
		return COG.formatStr('DWITHIN({0}, {1}({2}), {3}, {4})',
			args.property,
			args.type,
			pointCalc(args.coords),
			args.distance,
			args.unit);
	} // distance
	
	function like(args) {
		args = COG.extend({
			property: 'Name'
		}, args);
		
	//	var cqlQuery = args.property + " LIKE '%25" + args.value + "%25'"; 
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
	
	// Adds commas to the linestring except the last point
	function pointCalc(coords) {
		return coords.join(",");
	} // pointCalc
	
	/* exports */

	function buildRequest(params, cqlJson, callback) {
		// initialise defaults
		params = COG.extend({
			service: 'WFS',
			version: '1.1.0',
			request: 'GetFeature',
			maxFeatures: 20000,
			outputFormat: 'json'
		}, params);
		
		/* extra params
			REQUIRED - typeName :
			OPTIONAL - propertName :  
		*/
		
		if (params.typeName === null) {
			console.debug("Dataset not specified");
			return false;
		} // if
		
		if (cqlJson) {
			params.cql_filter = cql(cqlJson);
		} // if
		
		if (callback) {
			var callbackId = 'c' + new Date().getTime();

			module.callbacks[callbackId] = function(data) {
				callback(data);
				delete module.callbacks[callbackId];
			}; // temp callback
			
			params.format_options = "callback:GEOSERVER.callbacks." + callbackId;
		} // if
		
		return params;
	
	} // buildRequest
	
	var module = {
		cql: cql,
		buildRequest: buildRequest,
		callbacks: {}
	};
	
	return module;
})();