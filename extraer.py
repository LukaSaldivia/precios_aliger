import re
import json
from datetime import datetime

input_file = 'may.rtf'
changes_file = 'cambios.rtf'
output_file_json = 'output.json'
today = datetime.now()

data = {}
data['grupos'] = {}
data['cambios'] = {}
data['fecha'] = today.strftime('%d-%m-%Y %H:%M:%S')
current_group = ''
current_product = ''
precio = None

with open(input_file, 'r') as infile:
    for line in infile:
        # POS X 1860 -> grupo de venta ej : \posx1860\pvpg\posy9060 Quesada, -> \posx1860\pvpg\posyN Nombre
        # POS X 4620 -> producto ej: \posx4620\pvpg\posy9540 BARRA SABORIZADA QUESADA -> \posx4620\pvpg\posyN Nombre
        # POS X 7980 -> precio de producto ej : \posx7980\pvpg\posy3615\qr\absw1320 5205.720, -> \posx7980\pvpg\posyN\qr\absw1320 $precio
       
        matches = re.finditer(r'\\pard \\plain \\nowrap\\f0\\fs18\\phpg\\posx(1860|4620|7980)\\pvpg\\posy[0-9]+(.*?)\s?\\par', line)  # Busca todas las coincidencias
       
        for match in matches:

            posx = match.groups()[0]

            if posx == '1860': # Si es un grupo
                current_group = match.groups()[1].strip()
                data['grupos'][current_group] = {}

            if posx == '7980': # Si es un precio
                precio = match.groups()[1].split(' ')[-1]

            if posx == '4620': # Si es un producto
                current_product = match.groups()[1].strip()
                data['grupos'][current_group][current_product] = precio
                precio = None

with open(changes_file, 'r') as infile:
    for line in infile:
        # POS X 735 -> grupo de venta
        # POS X 2505 -> producto
        # POS X 5865 -> precio de producto
        # print(line)
       
        matches = re.finditer(r'\\pard \\plain \\nowrap\\f0\\fs18\\phpg\\posx(735|5865|2505)\\pvpg\\posy[0-9]+(.*?)\s?\\par', line)  # Busca todas las coincidencias
       
        for match in matches:


            posx = match.groups()[0]

            if posx == '735': # Si es un grupo
                current_group = match.groups()[1].strip()
                data['cambios'][current_group] = {}

            if posx == '5865': # Si es un precio
                precio = match.groups()[1].split(' ')[-1]

            if posx == '2505': # Si es un producto
                current_product = match.groups()[1].strip()
                data['cambios'][current_group][current_product] = precio
                precio = None



# Guardar en JSON
with open(output_file_json, 'w', encoding='utf-8') as outfile_json:
    json.dump(data, outfile_json, indent=4, ensure_ascii=False)
