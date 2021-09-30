

def translator(d,new_dict={},func=lambda my_str: my_str):

    for val in d.values():
        try:
           translator(val)
        except AttributeError:
           print(val)




def replace(data, repl):
    if isinstance(data, dict):
        return {k: replace(v, repl) for k, v in data.items()}
    elif isinstance(data, list):
        return [replace(x, repl) for x in data]
    else:
        return repl(data)



# update the source to the data,
    # if a prop is not on data, it wont be added
def update_dict(data, source):
    if source is None:
        return data
    elif isinstance(source, dict):
        return {k: update_dict(v, source.get(k)) for k, v in data.items()}
    elif isinstance(source, list):
        diff = len(source) - len(data)
        if(diff > 0):
            [data.append(x) for i,x in enumerate(source) if i > diff ]
        return [update_dict(x, source[i]) for i,x in enumerate(source)]
    else:
        return source







def update_target(data, source,repl= lambda x,y:  y):
    if isinstance(data, dict):
        for k, v in data.items():
            if k in source:
                data[k] = update_target(v, source[k],repl)
        return data
    elif isinstance(data, list):
        return [update_target(x,source[i], repl) for i,x in enumerate(data)]
    else:
        return repl(data,source)

