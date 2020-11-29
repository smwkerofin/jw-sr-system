# This is Python 3

import random

TokenCount={
    (1, 8): 1,
    (9, 12): 2,
    (13,15): 3,
    (16,18): 4,
    (19,19): 5
    }

tmp={}
for rdex in TokenCount:
    toks=TokenCount[rdex]
    for dex in range(rdex[0], rdex[1]+1):
        tmp[dex]=toks

TokenCount=tmp

def get_tokens(dex, coord=False, mobility=False, slow=False):
    if dex>19:
        count=TokenCount[19]
    elif dex<1:
        count=TokenCount[1]
    else:
        count=TokenCount[dex]

    if coord:
        count+=1
    if mobility:
        count+=1
    if slow:
        count-=1

    return max(count, 1)

class Bag:
    def __init__(self):
        self.clear()

    def clear(self):
        self.bag=[]

    def add(self, name, dex, coord=False, mobility=False, slow=False):
        for i in range(get_tokens(dex, coord, mobility, slow)):
            self.bag.append(name)

    def shuffle(self):
        random.shuffle(self.bag)

    def draw(self):
        if not self.bag:
            return

        result=self.bag[0]
        del self.bag[0]

        return result

    def empty(self):
        return len(self.bag)==0

    def count_of(self, actor):
        return self.bag.count(actor)

    def __str__(self):
        return 'Bag '+str(self.bag)

def test():
    for dex in range(1,20):
        print(dex, get_tokens(dex), get_tokens(dex, True),
              get_tokens(dex, slow=True))

    bag=Bag()
    print(bag)
    bag.add('Harsta', 17, True, True)
    bag.add('Bad guy', 14, slow=True)
    print(bag, bag.count_of('Harsta'))
    bag.shuffle()
    print(bag)
    while not bag.empty():
        actor=bag.draw()
        print('%s, %d remaining' % (actor, bag.count_of(actor)))

if __name__=='__main__':
    test()
