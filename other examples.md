 class main[]

	set a to 5
	set b to 3
	set result to multiply(a, b)
	print(result)

	import numpy as np<<testing things on pscript and the code's translation into actual python code>>
	set name to input("what is your name? ")
	arr data => [2,4,5,1,6,7,4,35,63,2,3,5]
	set age to int(input("what is your age? "))
	print(f"hello {name}, you are {age} years old, nice to meet you")
	print(np.sort(data))
	print(f"{30 < 20} {30 > 20}")
end[]

func multiply(val1,val2)
	return val1 * val2
end[]
