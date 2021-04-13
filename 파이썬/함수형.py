add = lambda a,b : a + b 


''' Hight order Function '''
def highFunc(f, a, b) :
	return f(a,b)

# 함수를 반환하는 함수를 만들 수 있다.
# 함수는 일급 객체이기 때문에 매개 변수로 활용 가능 함수를 반환하여 사용 할 수 있다.
def MakeAddFunc( add ):
	def Add(A) :
		return A + add 
	return Add

Addfunction = MakeAddFunc(10)
Addfunction(30)

print( MakeAddFunc(10)(30) )

# 문제점 
# tail recursion optimization 꼬리 재귀 최적화가 안됨
# lambda가 불편함
# immutable  data
# curring 

def recur(i):
	if ( i == 300 ):
		return
	recur(i + 1)

recur(0)

def tail_recur(f):
	def decorated(*args, **kwargs):
		while True:
  			try :
				return f(*args, **kwargs)
			except Recurse as r:
				args = r.args
				kwargs = r.kwargs
				continue
	return decorated

# Functional 하게 문제를 해결하는 순서
# 문제를 쪼갠다 그리고 순수함수를 만들고 함수를 형성 

# Category Theory for Programmers 


class name :

    def __init__(self):
        super().__init__()

    @staticmethod
    def go ():
        print("gogogo")