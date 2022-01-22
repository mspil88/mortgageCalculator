import urllib
import json
import os

FILE = "http://prod2.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com/pp-monthly-update.txt"

def read_file(FILE):
    txt = str(urllib.request.urlopen(FILE).read()).replace("b'", '')
    txt_rows = txt.split("\\n")
    txt_rows = [i.split(",") for i in txt_rows]
    
    return txt_rows
    
    
def struct(price, date, postcode, property_type, city, region):
    return {"price": price,
            "date": date,
            "postcode": postcode,
            "property_type": property_type,
            "outward_postcode": postcode.split(" ")[0],
            "city": city,
            "region": region}


def remove_quotation(elem):
    to_remove = '''"'''
    return elem.replace(to_remove, '')
    

def str_date(elem):
    return elem.split(" ")[0]
    

def get_property_type(elem):
    property_types = {"D": "detached", 
                      "S": "semi-detached",
                      "T": "terrace",
                      "F": "flat"}
    
    return property_types.get(elem, "")
        
    
def make_json(txt_data):
    container = []

    for i in txt_data:
        try:
            other_type = True if remove_quotation(i[4]) == "O" else False
            if other_type:
                continue
            else:
                data_struct = struct(int(i[1]), str_date(remove_quotation(i[2])), 
                                     remove_quotation(i[3]), get_property_type(remove_quotation(i[4])), 
                                     remove_quotation(i[12]), remove_quotation(i[13]))
                container.append(data_struct)
        except IndexError:
            continue
            
    return container
    
def write_out_json(data_container, path):
    with open(path, 'w') as file:
        json.dump(data_container, file, ensure_ascii=False)
    

def main():
    price_data = read_file(FILE)
    my_json = make_json(price_data)
    write_out_json(my_json, "price_data.json")

if __name__ == "main":
    main()

