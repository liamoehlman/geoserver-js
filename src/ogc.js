GEOSERVER.ogc = (function() {
	
	function formatCoords(coords) {
		var regexp = /([\-,0-9,\.]+)\s([\-,0-9,\.]+)/;
		coords.forEach(function(value, index, array) {
			coords[index] = coords[index].replace(regexp, "$2,$1");
		});
		
		return coords;
	}
	
	var ogcParser = function(query, params) {
		params = COG.extend({
			// for future needs
		}, params);
		
		function bbox(args) {
			args = COG.extend({
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
				pointCoords = '<gml:Point srsName="'+args.srs+'"><gml:coordinates>'+formatCoords(args.coords)+'</gml:coordindates></gml:point>';
			} 
			else if (args.type === 'LINESTRING') {
				pointCoords = '<gml:LineString srsName="'+args.srs+'"><gml:coordinates>'+formatCoords(args.coords).join(' ')+'</gml:coordinates></gml:LineString>';
			} // if...elseif
		
			// create the Dwithin portion of the filter
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

				// if we have a hander then execute it
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
