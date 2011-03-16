GEOSERVER = (function(){
	// initialise module variables
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
	
		// initialise defaults
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
				queryParams.push(COG.extend({}, requestParams));
				queryParams[0].filter = GEOSERVER.ogc.parseOGC(json);
				
				if (callback) {
					queryParams[0].format_options = "callback:GEOSERVER.callbacks." + createTempCallback(callback);
				} // if
								
			} else if (params.queryType === "cql") {
			
				if (params.maxPoints) {
					queries = GEOSERVER.cql.parseCQL(json, {maxPoints : maxPoints});
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