import re
import json

# Ruta del archivo de entrada y salida
input_file = 'may.rtf'
output_file_json = 'output.json'

data = {}
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

            if match.groups()[0] == '1860': # Si es un grupo
                data[match.groups()[1].strip()] = []
                current_group = match.groups()[1].strip()
                data[current_group] = {}

            if match.groups()[0] == '7980': # Si es un precio
                precio = match.groups()[1].split(' ')[-1]

            if match.groups()[0] == '4620': # Si es un producto
                current_product = match.groups()[1].strip()
                data[current_group][current_product] = precio
                precio = None


with open(output_file_json, 'w', encoding='utf-8') as outfile_json:
    json.dump(data, outfile_json, indent=4, ensure_ascii=False)
print(f"El archivo JSON se ha guardado en '{output_file_json}'.")
print("Estructura del JSON generada:")
print(json.dumps(data, indent=4, ensure_ascii=False))