import os
import json
import argparse
from ftfy import fix_text
from pprint import pprint

parser = argparse.ArgumentParser()
parser.add_argument('--source-file', required=True)
args = parser.parse_args()

with open(args.source_file) as data_file:
    game_data = json.load(data_file)

rounds = ('jeopardy', 'double-jeopardy')

for round in rounds:
    for category in game_data[round]:
        category['name'] = fix_text(category['name'].upper())
        for q in category['questions']:
            q['question'] = fix_text(q['question'].upper())
            q['answer'] = fix_text(q['answer'])

game_data['final-jeopardy']['category'] = fix_text(game_data['final-jeopardy']['category'].upper())
game_data['final-jeopardy']['question'] = fix_text(game_data['final-jeopardy']['question'].upper())


name, ext = os.path.splitext(args.source_file)
outfile_name = "{name}_{uid}{ext}".format(name=name, uid='formatted', ext=ext)

with open(outfile_name, 'w') as outfile:
    json.dump(game_data, outfile, indent=4)
