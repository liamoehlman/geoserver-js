

var json = {
	bbox : [{
	    conditions: [{
	        "type": "spatial.bbox",
	        "args": {
	            "property": "the_geom",
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
	            "property": "the_geom",
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
	            "property": "the_geom",
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
	            "property": "the_geom",
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
	            "property": "the_geom",
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
	        type: 'compound',
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
	                    "property": "the_geom",
	                    "min": "-28.96 138.08",
	                    "max": "-10.27 153.59"
	                }
	            },  {
	                type: 'compound',
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
	                            "property": "the_geom",
	                            "min": "-28.96 138.08",
	                            "max": "-10.27 153.59"
	                        }
	                    }]
	                }
				}]
	        }
	    }]
	}, // complex 1
	{
	    conditions: [{
	        "type": "spatial.distance",
	        "args": {
	            "property": "the_geom",
	            "type": "LINESTRING",
	            "distance" : ".05",
	            "unit": 'kilometers',
	            "coords": ["-27.68567 152.92974","-27.67592 152.90625","-27.66564 152.91007","-27.66769 152.91386","-27.66571 152.91735","-27.6273 152.94096","-27.62581 152.9407","-27.68542 153.18479","-28.22607 153.55685","-28.85697 153.56086","-28.86015 153.55913","-28.86819 153.55479","-28.86383 153.54567","-28.86321 153.53972","-28.86416 153.53251","-28.86468 153.52869","-29.70948 152.943","-29.71033 152.94405","-29.71044 152.94421","-29.71239 152.94803","-30.11302 153.19098","-30.30075 153.11062","-30.321 153.08594","-30.49422 153.01489","-30.704 152.92148","-30.70648 152.92101","-31.03767 152.8792","-31.03502 152.86238","-31.08052 152.84189","-32.78191 151.73874","-32.82325 151.68585","-32.82486 151.68398","-32.8118 151.65099","-32.81001 151.64625","-32.81324 151.63682","-32.81451 151.63577","-33.71482 151.11307","-33.71826 151.11059","-33.75101 151.14748","-33.75203 151.14457","-33.77561 151.13551","-33.81071 151.10585","-33.81702 151.10241","-33.82267 151.09636","-33.83499 151.08856","-33.88253 151.06943","-33.88536 151.0696","-33.88586 151.06927","-33.90584 151.04059","-33.9196 151.04013","-33.94063 151.0356","-33.94004 151.03131","-34.79881 149.61425","-36.51501 146.06428","-37.56631 144.94151","-37.68385 144.98519","-37.69385 145.0932","-37.7345 145.07861","-37.73687 145.07553","-37.75967 145.06905","-37.76217 145.08334","-37.77925 145.07859","-37.77905 145.08208","-37.92104 145.21487","-37.92497 145.21398","-37.95412 145.34786","-37.92914 145.42319","-37.92861 145.49273","-37.93481 145.4922","-37.94698 145.53599","-37.90492 145.54695"]
	        }
	    }]
	}
	]
};

$(document).ready(function(){
	module("cql_filter tests");
	
	test("bbox tests", function(){
		expect(2);
		same(GEOSERVER.cql.parseCQL(json.bbox[0]), ["(BBOX(the_geom, -28.96, 138.08, -10.27, 153.59))"], "bbox1");
		same(GEOSERVER.cql.parseCQL(json.bbox[1]), ["(BBOX(the_geom, -28.96, 138.08, -10.27, 153.59))"], "bbox2");
	});
	
	test("contains tests", function(){
		same(GEOSERVER.cql.parseCQL(json.contains[0]), ["(CONTAINS(the_geom, POINT(-33.815941 149.324497)))"], "contains1");
		same(GEOSERVER.cql.parseCQL(json.contains[1]), ["(CONTAINS(the_geom, POINT(-33.815941 149.324497)))"], "contains2");
		same(GEOSERVER.cql.parseCQL(json.contains[2]), ["(CONTAINS(the_geom, POINT(-33.815941 149.324497)))"], "contains3");
	});
	
	test("distance tests", function(){
		same(GEOSERVER.cql.parseCQL(json.distance[0]), ["(DWITHIN(the_geom, LINESTRING(-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497,-33.815941 149.324497), .05, kilometers))"], "distance - linestring");
		same(GEOSERVER.cql.parseCQL(json.distance[6]), ["(DWITHIN(the_geom, LINESTRING(-33.815941 149.324497,-33.815941 149.324497), .05, kilometers))"], "distance - linestring");
		same(GEOSERVER.cql.parseCQL(json.distance[1]), ["(DWITHIN(the_geom, POINT(-33.815941 149.324497), .05, kilometers))"], "distance - point");
		same(GEOSERVER.cql.parseCQL(json.distance[2]), ["(DWITHIN(the_geom, POINT(-33.815941 149.324497), .05, kilometers))"], "distance - point");
		same(GEOSERVER.cql.parseCQL(json.distance[3]), ["(DWITHIN(the_geom, POINT(-33.815941 149.324497), .05, kilometers))"], "distance - point");
		same(GEOSERVER.cql.parseCQL(json.distance[4]), ["(DWITHIN(the_geom, POINT(-33.815941 149.324497), .05, kilometers))"], "distance - point");
		same(GEOSERVER.cql.parseCQL(json.distance[5]), ["(DWITHIN(the_geom, POINT(-33.815941 149.324497), .05, kilometers))"], "distance - point");
	});
	
	test("like tests", function(){
		same(GEOSERVER.cql.parseCQL(json.like[0]), ["(Name LIKE '%Cottage%')"], "Like");
	});
	
	test("Complex Queries", function() {
		same(GEOSERVER.cql.parseCQL(json.complex[0]), ["(Name LIKE '%Cottage%' AND (Name LIKE '%Hotel%' OR BBOX(the_geom, -28.96, 138.08, -10.27, 153.59) OR (Name LIKE '%Hotel%' OR BBOX(the_geom, -28.96, 138.08, -10.27, 153.59))))"], "Complex stacked query ");
	});
	
	module("OGC filtering tests");
	
	test("bbox tests", function(){
		expect(2);
		same(GEOSERVER.ogc.parseOGC(json.bbox[0]), ["(BBOX(the_geom, -28.96, 138.08, -10.27, 153.59))"], "bbox1");
		same(GEOSERVER.ogc.parseOGC(json.bbox[1]), ["(BBOX(the_geom, -28.96, 138.08, -10.27, 153.59))"], "bbox2");
	});
	
	test("like tests", function(){
		same(GEOSERVER.ogc.parseOGC(json.like[0]), "", "Like");
	});
	
	test("distance tests", function(){
		same(GEOSERVER.ogc.parseOGC(json.distance[0]), '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:DWithin><ogc:PropertyName>the_geom</ogc:PropertyName><gml:LineString EPSG:4326><gml:coordinates>-33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497</gml:coordindates></gml:LineString><ogc:Distance units="kilometers">.05</ogc:Distance></ogc:DWithin></ogc:Filter>', "OGC - Distance");
		same(GEOSERVER.ogc.parseOGC(json.distance[6]), '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:DWithin><ogc:PropertyName>the_geom</ogc:PropertyName><gml:LineString EPSG:4326><gml:coordinates>-33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497</gml:coordindates></gml:LineString><ogc:Distance units="kilometers">.05</ogc:Distance></ogc:DWithin></ogc:Filter>', "OGC - Distance");
		same(GEOSERVER.ogc.parseOGC(json.distance[1]), '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:DWithin><ogc:PropertyName>the_geom</ogc:PropertyName><gml:LineString EPSG:4326><gml:coordinates>-33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497</gml:coordindates></gml:LineString><ogc:Distance units="kilometers">.05</ogc:Distance></ogc:DWithin></ogc:Filter>', "OGC - Distance");
		same(GEOSERVER.ogc.parseOGC(json.distance[2]), '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:DWithin><ogc:PropertyName>the_geom</ogc:PropertyName><gml:LineString EPSG:4326><gml:coordinates>-33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497</gml:coordindates></gml:LineString><ogc:Distance units="kilometers">.05</ogc:Distance></ogc:DWithin></ogc:Filter>', "OGC - Distance");
		same(GEOSERVER.ogc.parseOGC(json.distance[3]), '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:DWithin><ogc:PropertyName>the_geom</ogc:PropertyName><gml:LineString EPSG:4326><gml:coordinates>-33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497</gml:coordindates></gml:LineString><ogc:Distance units="kilometers">.05</ogc:Distance></ogc:DWithin></ogc:Filter>', "OGC - Distance");
		same(GEOSERVER.ogc.parseOGC(json.distance[4]), '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:DWithin><ogc:PropertyName>the_geom</ogc:PropertyName><gml:LineString EPSG:4326><gml:coordinates>-33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497</gml:coordindates></gml:LineString><ogc:Distance units="kilometers">.05</ogc:Distance></ogc:DWithin></ogc:Filter>', "OGC - Distance");
		same(GEOSERVER.ogc.parseOGC(json.distance[5]), '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:DWithin><ogc:PropertyName>the_geom</ogc:PropertyName><gml:LineString EPSG:4326><gml:coordinates>-33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497 -33.815941,149.324497</gml:coordindates></gml:LineString><ogc:Distance units="kilometers">.05</ogc:Distance></ogc:DWithin></ogc:Filter>', "OGC - Distance");
	});
	
	test("Complex Queries", function() {
		same(GEOSERVER.ogc.parseOGC(json.complex[0]), ["(Name LIKE '%Cottage%' AND (Name LIKE '%Hotel%' OR BBOX(the_geom, -28.96, 138.08, -10.27, 153.59) OR (Name LIKE '%Hotel%' OR BBOX(the_geom, -28.96, 138.08, -10.27, 153.59))))"], "Complex stacked query ");
	});
	
});
