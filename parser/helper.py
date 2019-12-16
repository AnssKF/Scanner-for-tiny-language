import re
def is_str(token):
    return token.isalpha()

def is_num(token):
    return token.isdigit()

def is_col(c):
    return True if c == ':' else False

def is_symbol(token):
    symbol = ['+', '-', '*', '/', '=', '<', '>', '(', ')', ';']
    return True if token in symbol else False

def is_comment(token):
    return True if re.match(r'^{.+}$', token) else False

def is_identifier(token):
    return True if re.match(r'^', token) else False