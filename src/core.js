GEOSERVER = (function(){
	// initialise module variables
	var callbackCounter = 1;	
	
	function buildRequest(params, cqlJson, callback, maxPoints) {
		function createTempCallback() {
			var callbackId = 'cb_' + (callbackCounter++);
			
			module.callbacks[callbackId] = function(data) {
				callback(data);
				delete module.callbacks[callbackId];
			}; // temp callback
			
			return callbackId;
		} // createTempCallback
	
		// initialise defaults
		params = COG.extend({
			service: 'WFS',
			version: '1.1.0',
			request: 'GetFeature',
			maxFeatures: 20000,
			outputFormat: 'json',
			typeName : null
		}, params);
		
		var cqlQueries = [],
			queryParams = [],
			callbackBase = new Date().getTime();
		
		/* extra params
			REQUIRED - typeName :
			OPTIONAL - propertyName :  
		*/
		
		if (params.typeName === null) {
			console.debug("Dataset not specified");
		} // if
		
		if (cqlJson) {
			
			if (maxPoints) {
				cqlQueries = CQLParser(cqlJson, {maxPoints : maxPoints});
			} else {
				cqlQueries = CQLParser(cqlJson);
			} // if ... else
		
			for (var ii=0; ii < cqlQueries.length; ii++) {
				queryParams.push(COG.extend({}, params));
				queryParams[ii].cql_filter = cqlQueries[ii];

				if (callback) {
					queryParams[ii].format_options = "callback:GEOSERVER.callbacks." + createTempCallback(callback);
				} // if
			} // for
		} // if
	
		return queryParams;
	
	} // buildRequest
	
	var module = {
		buildRequest: buildRequest,
		callbacks: {}
	};
	
	return module;
	
})();