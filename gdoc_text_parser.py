import json
import argparse


def line_type(line_input):
    line = line_input.strip()
    if line == '':
        return 'blank', ''
    elif line.startswith('Q:'):
        return 'question', line[2:].strip().upper()
    elif line.startswith('A:'):
        return 'answer', line[2:].strip().upper()
    elif line.startswith('[') and line.endswith(']'):
        return 'comment', line.strip('[]')
    elif line in ['Jeopardy Round', 'Double Jeopardy', 'Final Jeopardy']:
        round_name = ''
        if line == 'Jeopardy Round':
            round_name = 'jeopardy'
        elif line == 'Double Jeopardy':
            round_name = 'double-jeopardy'
        else:
            round_name = 'final-jeopardy'
        return 'round', round_name
    else:
        return 'category', line.upper()


def process_input(lines):
    current_question = None
    category_name = None
    questions_in_round = []
    round_name = None
    game_round = None
    line_type = None
    game = {}
    for line in lines:
        (line_type, value) = line_type(line)
        if line_type == 'round':
            if category_name is not None:
                game_round.append({
                    'name': category_name,
                    'questions': questions_in_round
                })
            category_name = None
            questions_in_round = []

            if game_round is not None:
                game[round_name] = game_round
            round_name = value
            game_round = []

        elif line_type == 'category':
            if category_name is not None:
                game_round.append({
                    'name': category_name,
                    'questions': questions_in_round
                })
            category_name = value
            questions_in_round = []

        elif line_type == 'question':
            current_question = value

        elif line_type == 'answer':
            if round_name == 'final-jeopardy':
                game[round_name] = {
                    'category': category_name,
                    'question': current_question,
                    'answer': value
                }
                return game
            else:
                question_value = (len(questions_in_round)+1) * \
                    100*(2 if round_name == 'double-jeopardy' else 1)
                questions_in_round.append({
                    'question': current_question,
                    'answer': value,
                    'value': question_value
                })
            current_question = None
    return game


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Parses a save of a Google Docs file of Jeopardy game data, and parses it to JSON.')
    parser.add_argument('-i', dest='filename',
                        help='Input file to read from', required=True)
    args = parser.parse_args()

    with open(args.filename, encoding='utf8') as file:
        lines = file.readlines()
        game = process_input(lines)
        print(json.dumps(game, indent=2))
