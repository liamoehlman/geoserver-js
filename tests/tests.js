var json = {
	bbox : [{
	    conditions: [{
	        "type": "spatial.bbox",
	        "args": {
	            "property": "TheGeom",
	            "min": "-28.96 138.08",
	            "max": "-10.27 153.59"
			}
		}]
	},
	{
	    conditions: [{
	        "type": "spatial.bbox",
	        "args": {
	            "min": "-28.96 138.08",
	            "max": "-10.27 153.59"
	        }
		}]
	}],
	contains : [{
	    conditions: [{
	        "type": "spatial.contains",
	        "args": {
	            "property": "TheGeom",
	            "type": "POINT",
	            "coords": ["-33.815941 149.324497"]
	        }
	    }]
	},
	{
	    conditions: [{
	        "type": "spatial.contains",
	        "args": {
	            "type": "POINT",
	            "coords": ["-33.815941 149.324497"]
	        }
	    }]
	},
	{
	    conditions: [{
	        "type": "spatial.contains",
	        "args": {
	            "coords": ["-33.815941 149.324497"]
	        }
	    }]
	}],
	distance : [
	{
	    conditions: [{
	        "type": "spatial.distance",
	        "args": {
	            "property": "TheGeom",
	            "type": "LINESTRING",
	            "distance" : ".05",
	            "unit": 'kilometers',
	            "coords": ["-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497","-33.815941 149.324497"]
	        }
	    }]
	}, //0
	{
	    conditions: [{
	        "type": "spatial.distance",
	        "args": {
	            "property": "TheGeom",
	            "type": "POINT",
	            "distance" : ".05",
	            "unit": 'kilometers',
	            "coords": ["-33.815941 149.324497"]
	        }
	    }]
	}, //1
	{
	    conditions: [{
	        "type": "spatial.distance",
	        "args": {
	            "type": "POINT",
	            "distance" : ".05",
	            "unit" : "kilometers",
	            "coords": ["-33.815941 149.324497"]
	        }
	    }]
	}, //2
	{
	    conditions: [{
	        "type": "spatial.distance",
	        "args": {
	            "distance" : ".05",
	            "unit" : "kilometers",
	            "coords": ["-33.815941 149.324497"]
	        }
	    }]
	}, //3
	{
	    conditions: [{
	        "type": "spatial.distance",
	        "args": {
	            "unit" : "kilometers",
	            "coords": ["-33.815941 149.324497"]
	        }
	    }]
	}, //4
	{
	    conditions: [{
	        "type": "spatial.distance",
	        "args": {
	            "coords": ["-33.815941 149.324497"]
	        }
	    }]
	}, //5
	{
	    conditions: [{
	        "type": "spatial.distance",
	        "args": {
	            "property": "TheGeom",
	            "type": "LINESTRING",
	            "distance" : ".05",
	            "unit": 'kilometers',
	            "coords": ["-33.815941 149.324497","-33.815941 149.324497"]
	        }
	    }] //6
	}],
	like : [{
	    conditions: [{
	        "type": "like",
	        "args": {
	            "property": "Name",
	            "value": "Cottage"
	        }
	    }]
	}],
	complex : [
	{
	    operator: 'AND',
	    conditions: [{
	        "type": "like",
	        "args": {
	            "property": "Name",
	            "value": "Cottage"
	        }
	    }, {
	        type: 'cql',
	        args: {
	            operator: 'OR',
	            conditions: [{
	                "type": "like",
	                "args": {
	                    "property": "Name",
	                    "value": "Hotel"
	                }
	            }, {
	                "type": "spatial.bbox",
	                "args": {
	                    "property": "TheGeom",
	                    "min": "-28.96 138.08",
	                    "max": "-10.27 153.59"
	                }
	            },  {
	                type: 'cql',
	                args: {
	                    operator: 'OR',
	                    conditions: [{
	                        "type": "like",
	                        "args": {
	                            "property": "Name",
	                            "value": "Hotel"
	                        }
	                    }, {
	                        "type": "spatial.bbox",
	                        "args": {
	                            "property": "TheGeom",
	                            "min": "-28.96 138.08",
	                            "max": "-10.27 153.59"
	                        }
	                    }]
	                }
	                }]
	        }
	    } // complex 1
	    ]
	}]
};

$(document).ready(function(){
	module("cql_filter tests");
	
	test("bbox tests", function(){
		expect(2);
		equal(GEOSERVER.cql(json.bbox[0]), "(BBOX(TheGeom, -28.96, 138.08, -10.27, 153.59))", "bbox1");
		equal(GEOSERVER.cql(json.bbox[1]), "(BBOX(TheGeom, -28.96, 138.08, -10.27, 153.59))", "bbox2");
	});
	
	test("contains tests", function(){
		equal(GEOSERVER.cql(json.contains[0]), "(CONTAINS(TheGeom, POINT(-33.815941 149.324497)))", "contains1");
		equal(GEOSERVER.cql(json.contains[1]), "(CONTAINS(TheGeom, POINT(-33.815941 149.324497)))", "contains2");
		equal(GEOSERVER.cql(json.contains[2]), "(CONTAINS(TheGeom, POINT(-33.815941 149.324497)))", "contains3");
	});
	
	test("distance tests", function(){
		equal(GEOSERVER.cql(json.distance[0]), "(DWITHIN(TheGeom, LINESTRING(-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497), .05, kilometers))", "distance - linestring");
		equal(GEOSERVER.cql(json.distance[6]), "(DWITHIN(TheGeom, LINESTRING(-33.815941 149.324497,-33.815941 149.324497), .05, kilometers))", "distance - linestring");
		equal(GEOSERVER.cql(json.distance[1]), "(DWITHIN(TheGeom, POINT(-33.815941 149.324497), .05, kilometers))", "distance - point");
		equal(GEOSERVER.cql(json.distance[2]), "(DWITHIN(TheGeom, POINT(-33.815941 149.324497), .05, kilometers))", "distance - point");
		equal(GEOSERVER.cql(json.distance[3]), "(DWITHIN(TheGeom, POINT(-33.815941 149.324497), .05, kilometers))", "distance - point");
		equal(GEOSERVER.cql(json.distance[4]), "(DWITHIN(TheGeom, POINT(-33.815941 149.324497), .05, kilometers))", "distance - point");
		equal(GEOSERVER.cql(json.distance[5]), "(DWITHIN(TheGeom, POINT(-33.815941 149.324497), .05, kilometers))", "distance - point");
	});
	
	test("like tests", function(){
		equal(GEOSERVER.cql(json.like[0]), "(Name LIKE '%Cottage%')", "Like");
	});
	
	test("Complex Queries", function() {
		equal(GEOSERVER.cql(json.complex[0]), "(Name LIKE '%Cottage%' AND (Name LIKE '%Hotel%' OR BBOX(TheGeom, -28.96, 138.08, -10.27, 153.59) OR (Name LIKE '%Hotel%' OR BBOX(TheGeom, -28.96, 138.08, -10.27, 153.59))))", "Complex stacked query ");
	});

});


