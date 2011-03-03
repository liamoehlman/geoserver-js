GEOSERVER = (function(){
	/* internals */
	var queryHandlers = {
		'spatial.bbox' : function(args) {
			var min = T5.Geo.Position.parse(args.min),
				max = T5.Geo.Position.parse(args.max),
				cqlQuery = "BBOX("+args.property+", "+min.lat+", "+min.lon+", "+max.lat+", "+max.lon+")";
			return cqlQuery;
		}, // spatial.bbox
		'spatial.contains' : function(args) {
			var cqlQuery = "CONTAINS("+args.property+", "+args.type+"("+pointCalc(args.coords)+"))";
			return cqlQuery;
		},
		'spatial.cross' : function(args) {
			var cqlQuery = "CROSS("+args.property+", "+args.type+"("+pointCalc(args.coords)+"))";
			return cqlQuery;
		},
		'spatial.intersect' : function(args) {
			var coords = [].concat(args.coords),
				cqlQuery = "INTERSECT("+args.property+", GEOMETRYCOLLECTION (POINT ("+coords[0]+"),POINT ("+coords[1]+"),LINESTRING ("+pointCalc(coords.splice(0,2))+")) )";
			return cqlQuery;
		},
		'spatial.distance' : function(args) {
		// note - distince is actually degrees, the distance parameter in the query doesn't work
			var cqlQuery = "DWITHIN("+args.property+", "+args.type+"("+pointCalc(args.coords)+"), "+args.distance+", kilometers)";
			return cqlQuery;
		},
		like  : function(args) {
			var cqlQuery = args.property + " LIKE '%25" + args.value + "%25'"; 
			return cqlQuery;
		} // like
	};
	
	// Adds commas to the linestring except the last point
	function pointCalc(coords) {
		var points = '';

		for (var ii = 0; ii<coords.length; ii++) {

			if (ii === (coords.length - 1)) {
				points = points + coords[ii];
			} else {
				points = points + coords[ii] + ",";
			} // if...else
		} // for
		return points;
	} // pointCalc
	
	/* exports */
	
	function cql(json) {
		var query = "";
		var data = JSON.parse(json);
		
		// Creates the query for one entry
		if (data.length === 1) {
						
			if (queryHandlers[data[0].type]) {
				query = query+queryHandlers[data[0].type](data[0].args);
			} // if
		// Creates the query for multiple entries
		} else {
			
			for (var ii=0 ; ii < data.length; ii++) {
				
				if (queryHandlers[data[ii].type] && ii<1) {
					query = query+queryHandlers[data[ii].type](data[ii].args);
				} // if
				
				if (queryHandlers[data[ii].type] && ii>0) {
					query = query+ " AND " +queryHandlers[data[ii].type](data[ii].args);
				} // if 
			} // for					
		} // if...else
		return query;
	} // cql

	function buildRequest(params, cqlJson, callback) {
		// initialise defaults
		params = COG.extend({
			service: 'WFS',
			version: '1.1.0',
			request: 'GetFeature',
			maxFeatures: 200,
			outputFormat: 'json'
		}, params);
		
		/* extra params
			REQUIRED - typeName :
			OPTIONAL - propertName :  
		*/
		
		if (params.dataSet === null) {
			console.debug("Dataset not specified");
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