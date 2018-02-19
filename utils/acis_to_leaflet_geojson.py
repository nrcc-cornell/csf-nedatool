'''Reformat county geojson.

	Reformat county geojson from ACIS into a geojson used in this tool by leaflet.

'''
import json

ifile = open('ny_county_acis.geojson','r')
features = json.load(ifile)
ifile.close()

featureList = []
for feature in features["meta"]:
	featureOut = {}
	featureOut["geometry"] = feature["geojson"]
	featureOut["type"] = "Feature"
	featureOut["properties"] = {"name":feature["name"].replace(' County','')}
	featureList.append(featureOut)

jsonOut = {}
jsonOut["type"] = "FeatureCollection"
jsonOut["features"] = featureList

ofile = open('ny_county.geojson','w')
json.dump(jsonOut,ofile)
ofile.close()
