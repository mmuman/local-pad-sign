#!/usr/bin/env python3

import json
import yaml
try:
    from urllib import request
except ImportError:
    import urllib2 as request

with request.urlopen("https://framagit.org/framasoft/framapad/-/raw/master/app/data/project.yml?inline=false") as stream:
    #with open("project.yml", 'r') as stream:
    data_loaded = yaml.safe_load(stream)
    data = data_loaded['instances']
    with open('js/instances.js', 'w') as outfile:
        outfile.write("const instances = ")
        json.dump(data, outfile)
        outfile.write(";")
